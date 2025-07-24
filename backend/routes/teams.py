from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import Team, TeamCreate, User, Game
from auth import get_current_active_user, is_admin, is_moderator_or_admin
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/teams", tags=["Teams"])

# Get database from database module
from database import db

@router.post("/", response_model=Team)
async def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new team with current user as captain."""
    try:
        # Check if team name already exists for this game
        existing_team = await db.teams.find_one({
            "name": team_data.name,
            "game": team_data.game
        })
        
        if existing_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A team named '{team_data.name}' already exists for {team_data.game}"
            )
        
        new_team = Team(
            **team_data.dict(),
            captain_id=current_user.id,
            members=[current_user.id]  # Captain is automatically a member
        )
        
        await db.teams.insert_one(new_team.dict())
        
        # Update user profile team count
        await db.user_profiles.update_one(
            {"user_id": current_user.id},
            {"$inc": {"total_teams": 1}}
        )
        
        logger.info(f"Team created: {team_data.name} by {current_user.username}")
        
        return new_team
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating team: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating team"
        )

@router.get("/", response_model=List[Team])
async def get_teams(
    game: Optional[Game] = None,
    is_open: Optional[bool] = None,
    limit: int = Query(20, le=100),
    skip: int = Query(0, ge=0)
):
    """Get teams with optional filtering."""
    try:
        filter_dict = {}
        if game:
            filter_dict["game"] = game
        if is_open is not None:
            filter_dict["is_open"] = is_open
        
        teams = await db.teams.find(filter_dict).skip(skip).limit(limit).to_list(limit)
        return [Team(**team) for team in teams]
        
    except Exception as e:
        logger.error(f"Error getting teams: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching teams"
        )

@router.get("/my-teams", response_model=List[Team])
async def get_my_teams(
    current_user: User = Depends(get_current_active_user)
):
    """Get teams where current user is captain or member."""
    try:
        teams = await db.teams.find({
            "$or": [
                {"captain_id": current_user.id},
                {"members": {"$in": [current_user.id]}}
            ]
        }).to_list(100)
        
        return [Team(**team) for team in teams]
        
    except Exception as e:
        logger.error(f"Error getting user teams: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching user teams"
        )

@router.get("/{team_id}", response_model=Team)
async def get_team(team_id: str):
    """Get a specific team."""
    try:
        team_data = await db.teams.find_one({"id": team_id})
        if not team_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        return Team(**team_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting team {team_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching team"
        )

@router.post("/{team_id}/join")
async def join_team(
    team_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Join a team as a member."""
    try:
        # Get team
        team_data = await db.teams.find_one({"id": team_id})
        if not team_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = Team(**team_data)
        
        # Check if team is open for new members
        if not team.is_open:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team is not accepting new members"
            )
        
        # Check if user is already a member
        if current_user.id in team.members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already a member of this team"
            )
        
        # Check if team is full
        if len(team.members) >= team.max_members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team is full"
            )
        
        # Add user to team
        await db.teams.update_one(
            {"id": team_id},
            {
                "$push": {"members": current_user.id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        logger.info(f"User {current_user.username} joined team {team.name}")
        
        return {"message": f"Successfully joined team {team.name}"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error joining team {team_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error joining team"
        )

@router.delete("/{team_id}/leave")
async def leave_team(
    team_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Leave a team."""
    try:
        # Get team
        team_data = await db.teams.find_one({"id": team_id})
        if not team_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = Team(**team_data)
        
        # Check if user is a member
        if current_user.id not in team.members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not a member of this team"
            )
        
        # Captain cannot leave unless transferring captaincy or disbanding team
        if team.captain_id == current_user.id:
            if len(team.members) > 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Captain must transfer captaincy or disband team before leaving"
                )
            else:
                # If captain is the only member, disband the team
                await db.teams.delete_one({"id": team_id})
                logger.info(f"Team {team.name} disbanded by captain {current_user.username}")
                return {"message": f"Team {team.name} disbanded"}
        
        # Remove user from team
        await db.teams.update_one(
            {"id": team_id},
            {
                "$pull": {"members": current_user.id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        logger.info(f"User {current_user.username} left team {team.name}")
        
        return {"message": f"Successfully left team {team.name}"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error leaving team {team_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error leaving team"
        )

@router.put("/{team_id}/captain")
async def transfer_captaincy(
    team_id: str,
    new_captain_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Transfer team captaincy to another member."""
    try:
        # Get team
        team_data = await db.teams.find_one({"id": team_id})
        if not team_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = Team(**team_data)
        
        # Check if current user is captain
        if team.captain_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team captain can transfer captaincy"
            )
        
        # Check if new captain is a member
        if new_captain_id not in team.members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New captain must be a team member"
            )
        
        # Transfer captaincy
        await db.teams.update_one(
            {"id": team_id},
            {
                "$set": {
                    "captain_id": new_captain_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Team {team.name} captaincy transferred to {new_captain_id} by {current_user.username}")
        
        return {"message": "Captaincy transferred successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error transferring captaincy {team_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error transferring captaincy"
        )

@router.delete("/{team_id}")
async def delete_team(
    team_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a team. Only captain or admin can do this."""
    try:
        # Get team
        team_data = await db.teams.find_one({"id": team_id})
        if not team_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = Team(**team_data)
        
        # Check permissions
        if team.captain_id != current_user.id and not is_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team captain or admin can delete team"
            )
        
        # Delete the team
        delete_result = await db.teams.delete_one({"id": team_id})
        
        if delete_result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete team"
            )
        
        logger.info(f"Team {team.name} deleted by {current_user.username}")
        
        return {"message": f"Team '{team.name}' deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting team {team_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting team"
        )

@router.put("/{team_id}")
async def update_team(
    team_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None,
    is_open: Optional[bool] = None,
    max_members: Optional[int] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Update team details. Only captain can do this."""
    try:
        # Get team
        team_data = await db.teams.find_one({"id": team_id})
        if not team_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = Team(**team_data)
        
        # Check permissions
        if team.captain_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team captain can update team"
            )
        
        # Prepare update fields
        update_fields = {"updated_at": datetime.utcnow()}
        
        if name is not None:
            # Check if new name already exists for this game
            existing_team = await db.teams.find_one({
                "name": name,
                "game": team.game,
                "id": {"$ne": team_id}
            })
            if existing_team:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"A team named '{name}' already exists for {team.game}"
                )
            update_fields["name"] = name
        
        if description is not None:
            update_fields["description"] = description
        
        if is_open is not None:
            update_fields["is_open"] = is_open
        
        if max_members is not None:
            if max_members < len(team.members):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot set max_members to {max_members}, team currently has {len(team.members)} members"
                )
            update_fields["max_members"] = max_members
        
        # Update team
        await db.teams.update_one(
            {"id": team_id},
            {"$set": update_fields}
        )
        
        logger.info(f"Team {team.name} updated by {current_user.username}")
        
        return {"message": "Team updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating team {team_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating team"
        )

@router.get("/stats/community")
async def get_team_stats():
    """Get team statistics for the community."""
    try:
        total_teams = await db.teams.count_documents({})
        open_teams = await db.teams.count_documents({"is_open": True})
        
        # Get teams by game
        pipeline = [
            {"$group": {"_id": "$game", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        games_stats = await db.teams.aggregate(pipeline).to_list(None)
        
        # Get average team size
        size_pipeline = [
            {"$group": {"_id": None, "avg_size": {"$avg": {"$size": "$members"}}}}
        ]
        size_result = await db.teams.aggregate(size_pipeline).to_list(1)
        avg_team_size = round(size_result[0]["avg_size"] if size_result else 0, 1)
        
        return {
            "total_teams": total_teams,
            "open_teams": open_teams,
            "games_popularity": [{"game": stat["_id"], "count": stat["count"]} for stat in games_stats],
            "average_team_size": avg_team_size,
            "community_engagement": {
                "teams_looking_for_members": open_teams,
                "team_formation_rate": round((open_teams / total_teams * 100) if total_teams > 0 else 0, 2)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting team stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching team statistics"
        )