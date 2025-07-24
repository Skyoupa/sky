from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
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

# Get database from database module
from database import db

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
    team_id: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Register current user (or their team) for a tournament."""
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
        
        # Determine tournament type based on max_participants and title
        tournament_requires_team = False
        tournament_name = tournament.title.lower()
        
        # Check tournament name patterns first (most reliable)
        if "1v1" in tournament_name or "1vs1" in tournament_name:
            tournament_requires_team = False
        elif "2v2" in tournament_name or "2vs2" in tournament_name:
            tournament_requires_team = True
            # Ensure max_participants is multiple of 2 for 2v2 tournaments
            if tournament.max_participants % 2 != 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="For 2v2 tournaments, max_participants must be a multiple of 2"
                )
        elif "5v5" in tournament_name or "5vs5" in tournament_name:
            tournament_requires_team = True
            # Ensure max_participants is multiple of 5 for 5v5 tournaments
            if tournament.max_participants % 5 != 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="For 5v5 tournaments, max_participants must be a multiple of 5"
                )
        else:
            # Fallback to max_participants logic
            # For individual tournaments: max_participants typically 8, 16, 32, etc.
            # For team tournaments: max_participants typically 4 (2v2), 10 (5v5), etc.
            # If max_participants is small (2-4), it's likely a team tournament
            # If max_participants is larger (8+), it's likely individual
            if tournament.max_participants <= 4:
                tournament_requires_team = True
                # For small numbers, assume 2v2 and validate multiple of 2
                if tournament.max_participants % 2 != 0:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="For team tournaments with few participants, max_participants must be a multiple of 2"
                    )
            else:
                tournament_requires_team = False
        
        participant_id = current_user.id
        
        # For team tournaments, team_id is required
        if tournament_requires_team:
            if not team_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Team is required for this tournament type. Please select a team."
                )
            
            # Verify the team exists and user is a member
            team_data = await db.teams.find_one({"id": team_id})
            if not team_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Team not found"
                )
            
            from models import Team
            team = Team(**team_data)
            
            # Check if user is captain or member
            if current_user.id not in team.members:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You must be a member of the team to register it"
                )
            
            # Check if team game matches tournament game
            if team.game != tournament.game:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Team game ({team.game}) doesn't match tournament game ({tournament.game})"
                )
            
            # Use team ID as participant
            participant_id = team_id
        
        # For individual tournaments, team_id should not be provided (optional check)
        elif team_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This is an individual tournament. Team registration is not allowed."
            )
        
        # Check if already registered (user or team)
        if participant_id in tournament.participants:
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
        
        # Register participant (user or team)
        await db.tournaments.update_one(
            {"id": tournament_id},
            {"$push": {"participants": participant_id}}
        )
        
        # Update user profile tournament count
        await db.user_profiles.update_one(
            {"user_id": current_user.id},
            {"$inc": {"total_tournaments": 1}},
            upsert=True
        )
        
        registration_type = "team" if team_id else "individual"
        logger.info(f"User {current_user.username} registered for tournament {tournament.title} as {registration_type}")
        
        return {"message": "Successfully registered for tournament", "type": registration_type}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering for tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error registering for tournament"
        )

@router.get("/{tournament_id}/user-teams")
async def get_user_teams_for_tournament(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get user's teams that are eligible for tournament registration."""
    try:
        # Get tournament to check game type
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = Tournament(**tournament_data)
        
        # Get user's teams for the tournament game
        user_teams = await db.teams.find({
            "members": {"$in": [current_user.id]},
            "game": tournament.game
        }).to_list(50)
        
        # Format teams with member info
        eligible_teams = []
        for team_data in user_teams:
            from models import Team
            team = Team(**team_data)
            
            # Get member names
            member_names = []
            for member_id in team.members:
                member = await db.users.find_one({"id": member_id})
                if member:
                    member_names.append({
                        "id": member["id"],
                        "username": member["username"]
                    })
            
            # Get captain name
            captain = await db.users.find_one({"id": team.captain_id})
            captain_name = captain["username"] if captain else "Unknown"
            
            eligible_teams.append({
                "id": team.id,
                "name": team.name,
                "game": team.game,
                "captain": captain_name,
                "is_captain": team.captain_id == current_user.id,
                "members": member_names,
                "member_count": len(team.members),
                "max_members": team.max_members,
                "description": team.description
            })
        
        # Determine if tournament requires team
        tournament_requires_team = False
        tournament_name = tournament.title.lower()
        
        # Check tournament name patterns first (most reliable)
        if "1v1" in tournament_name or "1vs1" in tournament_name:
            tournament_requires_team = False
        elif "2v2" in tournament_name or "2vs2" in tournament_name:
            tournament_requires_team = True
            # Validate max_participants is multiple of 2 for 2v2 tournaments
            if tournament.max_participants % 2 != 0:
                logger.warning(f"Tournament {tournament.title} has invalid max_participants ({tournament.max_participants}) for 2v2 tournament")
        elif "5v5" in tournament_name or "5vs5" in tournament_name:
            tournament_requires_team = True
            # Validate max_participants is multiple of 5 for 5v5 tournaments
            if tournament.max_participants % 5 != 0:
                logger.warning(f"Tournament {tournament.title} has invalid max_participants ({tournament.max_participants}) for 5v5 tournament")
        else:
            # Fallback to max_participants logic
            if tournament.max_participants <= 4:
                tournament_requires_team = True
            else:
                tournament_requires_team = False
        
        return {
            "tournament_id": tournament_id,
            "tournament_name": tournament.title, 
            "tournament_game": tournament.game,
            "requires_team": tournament_requires_team,
            "eligible_teams": eligible_teams,
            "can_register_individual": not tournament_requires_team
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user teams for tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting user teams for tournament"
        )

@router.delete("/{tournament_id}")
async def delete_tournament(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a tournament (admin only). Cannot delete if tournament is in progress or completed."""
    try:
        # Check admin permissions
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can delete tournaments"
            )
        
        # Get tournament
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = Tournament(**tournament_data)
        
        # Check if tournament can be deleted (prevent deletion of in-progress tournaments)
        if tournament.status == TournamentStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete tournament that is currently in progress"
            )
        
        # Clean up participant registrations first
        for participant_id in tournament.participants:
            # Update user profile tournament count
            await db.user_profiles.update_one(
                {"user_id": participant_id},
                {"$inc": {"total_tournaments": -1}},
                upsert=True
            )
        
        # Delete associated matches
        await db.matches.delete_many({"tournament_id": tournament_id})
        
        # Delete the tournament
        result = await db.tournaments.delete_one({"id": tournament_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        logger.info(f"Tournament {tournament.title} deleted by admin {current_user.username}")
        
        return {"message": f"Tournament '{tournament.title}' has been successfully deleted"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting tournament"
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

@router.get("/{tournament_id}/participants-info")
async def get_tournament_participants_info(tournament_id: str):
    """Get detailed information about tournament participants (users and teams)."""
    try:
        # Get tournament
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )

        tournament = Tournament(**tournament_data)
        participants_info = []

        for participant_id in tournament.participants:
            # Try to find as user first
            user_data = await db.users.find_one({"id": participant_id})
            if user_data:
                participants_info.append({
                    "id": participant_id,
                    "type": "user",
                    "name": user_data["username"],
                    "display_name": user_data["username"]
                })
                continue
            
            # Try to find as team
            team_data = await db.teams.find_one({"id": participant_id})
            if team_data:
                participants_info.append({
                    "id": participant_id,
                    "type": "team", 
                    "name": team_data["name"],
                    "display_name": f"{team_data['name']} ({len(team_data['members'])}/{team_data['max_members']})",
                    "members_count": len(team_data["members"]),
                    "max_members": team_data["max_members"]
                })
                continue
            
            # Fallback for unknown participants
            participants_info.append({
                "id": participant_id,
                "type": "unknown",
                "name": f"Participant {participant_id[:8]}",
                "display_name": f"Participant {participant_id[:8]}"
            })

        return {
            "tournament_id": tournament_id,
            "tournament_type": tournament.tournament_type,
            "participants": participants_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting tournament participants info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching participants information"
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
    """Get popular CS2 tournament templates for Oupafamilly community."""
    templates = [
        {
            "name": "CS2 Quick Match 1v1",
            "description": "Duels rapides Counter-Strike 2 en 1v1",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 16,
            "suggested_duration_hours": 3,
            "rules": """🎯 FORMAT: Élimination directe 1v1
🗺️ MAPS: aim_botz, aim_map (maps d'aim officielles)
⏱️ DURÉE: First to 16 frags par match
🔫 ARMES: AK47/M4A4 uniquement, pas d'AWP
💰 ÉCONOMIE: Argent illimité pour achats
📋 RÈGLES SPÉCIALES:
- Pas de camping (max 10 secondes statique)
- Restart possible si problème technique
- Screenshot obligatoire du score final"""
        },
        {
            "name": "CS2 Team Deathmatch 5v5",
            "description": "Affrontement classique 5v5 en mode Team Deathmatch",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 32,
            "suggested_duration_hours": 5,
            "rules": """🎯 FORMAT: Élimination directe 5v5 Teams
🗺️ MAPS: Mirage, Inferno, Dust2, Cache (vote par équipe)
⏱️ DURÉE: First to 75 frags par équipe
🔫 ARMES: Toutes armes autorisées
💰 ÉCONOMIE: Argent illimité
📋 RÈGLES D'ÉQUIPE:
- Équipes fixes de 5 joueurs + 1 remplaçant
- Communication Discord obligatoire
- Capitaine d'équipe désigné
- Timeout autorisé (2 par équipe max)
🏆 FINALE: BO3 sur maps différentes"""
        },
        {
            "name": "CS2 Competitive 5v5",
            "description": "Tournoi compétitif officiel format Matchmaking",
            "game": "cs2",
            "tournament_type": "bracket",
            "max_participants": 32,
            "suggested_duration_hours": 8,
            "rules": """🎯 FORMAT: Double élimination bracket 5v5
🗺️ MAPS: Pool compétitif officiel (Mirage, Inferno, Dust2, Cache, Overpass, Vertigo, Ancient)
⏱️ DURÉE: MR12 (Premier à 13 rounds)
🔫 ARMES: Règles compétitives officielles
💰 ÉCONOMIE: Système d'économie standard CS2
📋 RÈGLES COMPÉTITIVES:
- Ban/Pick de maps (BO1 phases, BO3 finale)
- Équipes fixes de 5 joueurs + 2 remplaçants
- Overtime en MR3 (premier à 4 rounds)
- Pause technique autorisée (30 sec max)
- Anti-cheat requis (screenshot + démo)
🏆 STRUCTURE: Phases de groupe puis playoffs"""
        },
        {
            "name": "CS2 Retake Masters",
            "description": "Spécialité mode Retake - défense de sites",
            "game": "cs2",
            "tournament_type": "round_robin",
            "max_participants": 20,
            "suggested_duration_hours": 4,
            "rules": """🎯 FORMAT: Round Robin mode Retake
🗺️ MAPS: Sites A et B de Mirage, Inferno, Dust2
⏱️ DURÉE: 10 rounds par adversaire (5 en T, 5 en CT)
🔫 ARMES: Kit de retake prédéfini (AK/M4, utilitaires)
💰 ÉCONOMIE: Équipement standardisé
📋 RÈGLES RETAKE:
- Spawn T déjà sur site avec bombe posée
- CT doivent reprendre le site ou désamorcer
- 45 secondes par round maximum
- Points: +3 défuse, +2 élimination équipe T, +1 kill
🏆 CLASSEMENT: Cumul des points sur tous les matchs"""
        },
        {
            "name": "CS2 Aim Challenge",
            "description": "Compétition pure d'adresse et de précision",
            "game": "cs2",
            "tournament_type": "round_robin",
            "max_participants": 24,
            "suggested_duration_hours": 2,
            "rules": """🎯 FORMAT: Round Robin - Challenges d'aim
🗺️ MAPS: aim_botz, training_aim_csgo2
⏱️ ÉPREUVES:
1. Precision Test: 100 targets statiques (temps limité 2min)
2. Spray Control: Pattern AK47 et M4A4 (10 essais chacun)
3. Flick Shots: 50 targets aléatoires (3min max)
4. Tracking: Targets mobiles (5min)
🔫 ARMES: AK47, M4A4, Desert Eagle selon l'épreuve
📋 SCORING:
- Précision: Points par hit + bonus vitesse
- Spray: Distance moyenne du centre de mass
- Flick: Précision + temps de réaction
- Tracking: Pourcentage de temps sur cible
🏆 CLASSEMENT: Cumul des 4 épreuves"""
        },
        {
            "name": "CS2 Pistol Only Tournament",
            "description": "Tournoi exclusivement aux armes de poing",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 16,
            "suggested_duration_hours": 3,
            "rules": """🎯 FORMAT: Élimination directe 5v5
🗺️ MAPS: Mirage, Dust2, Cache (format réduit)
⏱️ DURÉE: Premier à 10 rounds (MR9)
🔫 ARMES: Pistolets uniquement (Glock, USP-S, P250, Desert Eagle, etc.)
💰 ÉCONOMIE: 8000$ start money, +800$ par round
📋 RÈGLES PISTOLET:
- Aucune arme principale autorisée
- Kevlar + casque autorisé
- Grenades limitées: 1 par type max
- Économie réduite pour encourager l'action
- No-scope AWP interdit (pas d'AWP de toute façon!)
🏆 SPÉCIFICITÉ: Met l'accent sur positioning et aim précis"""
        }
    ]
    
    return {"templates": templates}