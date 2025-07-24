from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from models import (
    Tournament, TournamentCreate, User, TournamentStatus, 
    TournamentType, Game, Match
)
from auth import get_current_active_user, is_admin, is_moderator_or_admin
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tournaments", tags=["Tournaments"])

# Get database from main server
from server import db

@router.post("/", response_model=Tournament)
async def create_tournament(
    tournament_data: TournamentCreate,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new tournament. For starting community, allow any member to create tournaments."""
    try:
        # For a growing community, be more permissive with tournament creation
        new_tournament = Tournament(
            **tournament_data.dict(),
            organizer_id=current_user.id,
            status=TournamentStatus.DRAFT
        )
        
        await db.tournaments.insert_one(new_tournament.dict())
        
        logger.info(f"Tournament created: {tournament_data.title} by {current_user.username}")
        
        return new_tournament
        
    except Exception as e:
        logger.error(f"Error creating tournament: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating tournament"
        )

@router.get("/", response_model=List[Tournament])
async def get_tournaments(
    status: Optional[TournamentStatus] = None,
    game: Optional[Game] = None,
    limit: int = Query(20, le=100),
    skip: int = Query(0, ge=0)
):
    """Get tournaments with optional filtering."""
    try:
        filter_dict = {}
        if status:
            filter_dict["status"] = status
        if game:
            filter_dict["game"] = game
        
        tournaments = await db.tournaments.find(filter_dict).skip(skip).limit(limit).to_list(limit)
        return [Tournament(**tournament) for tournament in tournaments]
        
    except Exception as e:
        logger.error(f"Error getting tournaments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching tournaments"
        )

@router.get("/{tournament_id}", response_model=Tournament)
async def get_tournament(tournament_id: str):
    """Get a specific tournament."""
    try:
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        return Tournament(**tournament_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching tournament"
        )

@router.post("/{tournament_id}/register")
async def register_for_tournament(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Register current user for a tournament."""
    try:
        # Get tournament
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = Tournament(**tournament_data)
        
        # Check if tournament is open for registration
        if tournament.status != TournamentStatus.OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament is not open for registration"
            )
        
        # Check if registration is still open
        if datetime.utcnow() > tournament.registration_end:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration period has ended"
            )
        
        # Check if user is already registered
        if current_user.id in tournament.participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already registered for this tournament"
            )
        
        # Check if tournament is full
        if len(tournament.participants) >= tournament.max_participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament is full"
            )
        
        # Register user
        await db.tournaments.update_one(
            {"id": tournament_id},
            {"$push": {"participants": current_user.id}}
        )
        
        # Update user profile tournament count
        await db.user_profiles.update_one(
            {"user_id": current_user.id},
            {"$inc": {"total_tournaments": 1}}
        )
        
        logger.info(f"User {current_user.username} registered for tournament {tournament.title}")
        
        return {"message": "Successfully registered for tournament"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering for tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error registering for tournament"
        )

@router.delete("/{tournament_id}/register")
async def unregister_from_tournament(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Unregister current user from a tournament."""
    try:
        # Get tournament
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = Tournament(**tournament_data)
        
        # Check if user is registered
        if current_user.id not in tournament.participants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not registered for this tournament"
            )
        
        # Check if tournament hasn't started yet
        if tournament.status == TournamentStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot unregister from ongoing tournament"
            )
        
        # Unregister user
        await db.tournaments.update_one(
            {"id": tournament_id},
            {"$pull": {"participants": current_user.id}}
        )
        
        # Update user profile tournament count
        await db.user_profiles.update_one(
            {"user_id": current_user.id},
            {"$inc": {"total_tournaments": -1}}
        )
        
        logger.info(f"User {current_user.username} unregistered from tournament {tournament.title}")
        
        return {"message": "Successfully unregistered from tournament"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error unregistering from tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error unregistering from tournament"
        )

@router.put("/{tournament_id}/status")
async def update_tournament_status(
    tournament_id: str,
    new_status: TournamentStatus,
    current_user: User = Depends(get_current_active_user)
):
    """Update tournament status. Only organizer or admin can do this."""
    try:
        # Get tournament
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = Tournament(**tournament_data)
        
        # Check permissions
        if tournament.organizer_id != current_user.id and not is_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only tournament organizer or admin can update status"
            )
        
        # Update status
        await db.tournaments.update_one(
            {"id": tournament_id},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
        
        logger.info(f"Tournament {tournament.title} status updated to {new_status} by {current_user.username}")
        
        return {"message": f"Tournament status updated to {new_status}"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating tournament status {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating tournament status"
        )

@router.get("/stats/community")
async def get_tournament_stats():
    """Get tournament statistics for the community."""
    try:
        total_tournaments = await db.tournaments.count_documents({})
        active_tournaments = await db.tournaments.count_documents({"status": "in_progress"})
        upcoming_tournaments = await db.tournaments.count_documents({"status": "open"})
        completed_tournaments = await db.tournaments.count_documents({"status": "completed"})
        
        # Get tournaments by game
        pipeline = [
            {"$group": {"_id": "$game", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        games_stats = await db.tournaments.aggregate(pipeline).to_list(None)
        
        # Get recent tournament activity (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_tournaments = await db.tournaments.count_documents({
            "created_at": {"$gte": thirty_days_ago}
        })
        
        return {
            "total_tournaments": total_tournaments,
            "active_tournaments": active_tournaments,
            "upcoming_tournaments": upcoming_tournaments,
            "completed_tournaments": completed_tournaments,
            "games_popularity": [{"game": stat["_id"], "count": stat["count"]} for stat in games_stats],
            "recent_activity": recent_tournaments,
            "community_engagement": {
                "tournaments_per_month": recent_tournaments,
                "completion_rate": round((completed_tournaments / total_tournaments * 100) if total_tournaments > 0 else 0, 2)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting tournament stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching tournament statistics"
        )

@router.get("/templates/popular")
async def get_popular_tournament_templates():
    """Get popular tournament templates for easy creation - helpful for new communities."""
    templates = [
        {
            "name": "CS2 Quick Match",
            "description": "Tournoi rapide Counter-Strike 2 en élimination directe",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 16,
            "suggested_duration_hours": 4,
            "rules": "Format BO1 jusqu'aux demi-finales, BO3 pour la finale. Maps: Mirage, Inferno, Dust2, Cache."
        },
        {
            "name": "WoW Arena Championship",
            "description": "Championnat d'arène World of Warcraft",
            "game": "wow",
            "tournament_type": "bracket",
            "max_participants": 8,
            "suggested_duration_hours": 6,
            "rules": "Format 3v3 Arena, double élimination. Compositions variées encouragées."
        },
        {
            "name": "LoL Community Cup",
            "description": "Coupe communautaire League of Legends",
            "game": "lol",
            "tournament_type": "bracket",
            "max_participants": 32,
            "suggested_duration_hours": 8,
            "rules": "Format 5v5 Rift, draft pick. BO1 phases de groupe, BO3 playoffs."
        },
        {
            "name": "Minecraft Building Contest",
            "description": "Concours de construction Minecraft",
            "game": "minecraft",
            "tournament_type": "round_robin",
            "max_participants": 20,
            "suggested_duration_hours": 48,
            "rules": "Thème surprise, 2h de construction, vote communautaire pour le gagnant."
        }
    ]
    
    return {"templates": templates}