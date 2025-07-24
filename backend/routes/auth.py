from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from models import (
    User, UserCreate, UserLogin, UserResponse, UserProfile, 
    UserProfileResponse, UserUpdate, Token, UserRole, UserStatus
)
from auth import (
    authenticate_user, create_access_token, get_password_hash,
    get_current_active_user, get_user_by_email, ACCESS_TOKEN_EXPIRE_MINUTES
)
from motor.motor_asyncio import AsyncIOMotorClient
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Get database from database module
from database import db

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    """Register a new user."""
    try:
        # Check if user already exists
        existing_user = await get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        existing_username = await db.users.find_one({"username": user_data.username})
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            role=UserRole.MEMBER,
            status=UserStatus.ACTIVE  # For a starting community, auto-activate users
        )
        
        # Insert user into database
        await db.users.insert_one(new_user.dict())
        
        # Create user profile
        user_profile = UserProfile(
            user_id=new_user.id,
            display_name=user_data.display_name
        )
        await db.user_profiles.insert_one(user_profile.dict())
        
        logger.info(f"New user registered: {user_data.email}")
        
        return UserResponse(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            role=new_user.role,
            status=new_user.status,
            created_at=new_user.created_at,
            is_verified=new_user.is_verified
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        )

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    """Login user and return access token."""
    try:
        user = await authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Update last login
        await db.users.update_one(
            {"id": user.id},
            {"$set": {"last_login": user.updated_at}}
        )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        logger.info(f"User logged in: {user_credentials.email}")
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error logging in"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        created_at=current_user.created_at,
        is_verified=current_user.is_verified
    )

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile."""
    try:
        profile_data = await db.user_profiles.find_one({"user_id": current_user.id})
        if not profile_data:
            # Create default profile if doesn't exist
            profile = UserProfile(
                user_id=current_user.id,
                display_name=current_user.username
            )
            await db.user_profiles.insert_one(profile.dict())
            profile_data = profile.dict()
        
        return UserProfileResponse(**profile_data)
        
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting profile"
        )

@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update current user profile."""
    try:
        update_data = {k: v for k, v in profile_update.dict().items() if v is not None}
        update_data["updated_at"] = current_user.updated_at
        
        result = await db.user_profiles.update_one(
            {"user_id": current_user.id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        # Get updated profile
        updated_profile = await db.user_profiles.find_one({"user_id": current_user.id})
        return UserProfileResponse(**updated_profile)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating profile"
        )

@router.get("/stats")
async def get_auth_stats(current_user: User = Depends(get_current_active_user)):
    """Get authentication statistics - useful for a growing community."""
    try:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        total_users = await db.users.count_documents({})
        active_users = await db.users.count_documents({"status": "active"})
        pending_users = await db.users.count_documents({"status": "pending"})
        
        # Get recent registrations (last 7 days)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_registrations = await db.users.count_documents({
            "created_at": {"$gte": week_ago}
        })
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "pending_users": pending_users,
            "recent_registrations": recent_registrations,
            "community_growth": {
                "week": recent_registrations,
                "active_percentage": round((active_users / total_users * 100) if total_users > 0 else 0, 2)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting auth stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting statistics"
        )