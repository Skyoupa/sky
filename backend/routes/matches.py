from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from models import Match, MatchCreate, User, MatchStatus
from auth import get_current_active_user, is_admin, is_moderator_or_admin
from datetime import datetime
import logging
import random

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/matches", tags=["Matches"])

# Get database from database module
from database import db

@router.get("/tournament/{tournament_id}", response_model=List[Match])
async def get_tournament_matches(tournament_id: str):
    """Get all matches for a tournament."""
    try:
        matches = await db.matches.find({"tournament_id": tournament_id}).to_list(100)
        return [Match(**match) for match in matches]
        
    except Exception as e:
        logger.error(f"Error getting tournament matches: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching tournament matches"
        )

@router.post("/tournament/{tournament_id}/generate-bracket")
async def generate_tournament_bracket(
    tournament_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Generate bracket for a tournament (admin only)."""
    try:
        if not is_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can generate brackets"
            )

        # Get tournament
        tournament_data = await db.tournaments.find_one({"id": tournament_id})
        if not tournament_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )

        from models import Tournament
        tournament = Tournament(**tournament_data)

        # Check if tournament has participants
        if len(tournament.participants) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament needs at least 2 participants to generate bracket"
            )

        # Randomize participants for bracket
        participants = tournament.participants.copy()
        random.shuffle(participants)

        # Generate bracket matches based on tournament type
        matches = []
        
        if tournament.tournament_type == "elimination":
            matches = generate_elimination_bracket(tournament_id, participants)
        elif tournament.tournament_type == "bracket":
            matches = generate_bracket_tournament(tournament_id, participants)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Bracket generation not supported for {tournament.tournament_type}"
            )

        # Save matches to database
        for match in matches:
            await db.matches.insert_one(match.dict())

        # Update tournament status to in_progress
        await db.tournaments.update_one(
            {"id": tournament_id},
            {
                "$set": {
                    "status": "in_progress",
                    "matches": [match.id for match in matches],
                    "updated_at": datetime.utcnow()
                }
            }
        )

        logger.info(f"Generated {len(matches)} matches for tournament {tournament.title}")
        
        return {
            "message": f"Bracket generated successfully with {len(matches)} matches",
            "matches_count": len(matches),
            "tournament_status": "in_progress"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating bracket for tournament {tournament_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating tournament bracket"
        )

def generate_elimination_bracket(tournament_id: str, participants: List[str]) -> List[Match]:
    """Generate single elimination bracket."""
    matches = []
    round_number = 1
    current_participants = participants.copy()
    
    # Ensure even number of participants (add bye if needed)
    if len(current_participants) % 2 != 0:
        current_participants.append("BYE")
    
    match_number = 1
    
    while len(current_participants) > 1:
        round_matches = []
        next_round_participants = []
        
        # Create matches for current round
        for i in range(0, len(current_participants), 2):
            player1 = current_participants[i]
            player2 = current_participants[i + 1] if i + 1 < len(current_participants) else "BYE"
            
            # Handle bye
            if player2 == "BYE":
                next_round_participants.append(player1)
                continue
            if player1 == "BYE":
                next_round_participants.append(player2)
                continue
            
            match = Match(
                tournament_id=tournament_id,
                round_number=round_number,
                match_number=match_number,
                player1_id=player1,
                player2_id=player2,
                status=MatchStatus.SCHEDULED,
                scheduled_time=datetime.utcnow()
            )
            
            matches.append(match)
            round_matches.append(match)
            match_number += 1
        
        # Add placeholder for winners
        for match in round_matches:
            next_round_participants.append(f"Winner of Match {match.match_number}")
        
        current_participants = next_round_participants
        round_number += 1
        
        # Safety check to prevent infinite loop
        if round_number > 10:
            break
    
    return matches

def generate_bracket_tournament(tournament_id: str, participants: List[str]) -> List[Match]:
    """Generate bracket tournament (similar to elimination but with better structure)."""
    return generate_elimination_bracket(tournament_id, participants)

@router.put("/{match_id}/result")
async def update_match_result(
    match_id: str,
    winner_id: str,
    player1_score: int = 0,
    player2_score: int = 0,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Update match result (admin only)."""
    try:
        if not is_moderator_or_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only moderators and admins can update match results"
            )

        # Get match
        match_data = await db.matches.find_one({"id": match_id})
        if not match_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )

        match = Match(**match_data)

        # Validate winner is one of the players
        if winner_id not in [match.player1_id, match.player2_id]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Winner must be one of the match participants"
            )

        # Update match
        await db.matches.update_one(
            {"id": match_id},
            {
                "$set": {
                    "winner_id": winner_id,
                    "player1_score": player1_score,
                    "player2_score": player2_score,
                    "status": MatchStatus.COMPLETED,
                    "completed_at": datetime.utcnow(),
                    "notes": notes,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Update next round match if exists
        await update_next_round_match(match.tournament_id, match.round_number, match.match_number, winner_id)

        logger.info(f"Match {match_id} result updated - Winner: {winner_id}")
        
        return {"message": "Match result updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating match result {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating match result"
        )

async def update_next_round_match(tournament_id: str, current_round: int, current_match: int, winner_id: str):
    """Update next round match with winner."""
    try:
        # Find next round match that should receive this winner
        next_round = current_round + 1
        next_match_number = (current_match + 1) // 2
        
        next_match = await db.matches.find_one({
            "tournament_id": tournament_id,
            "round_number": next_round,
            "match_number": next_match_number
        })
        
        if next_match:
            # Determine if winner should be player1 or player2 in next match
            if current_match % 2 == 1:  # Odd match number -> player1
                await db.matches.update_one(
                    {"id": next_match["id"]},
                    {"$set": {"player1_id": winner_id, "updated_at": datetime.utcnow()}}
                )
            else:  # Even match number -> player2
                await db.matches.update_one(
                    {"id": next_match["id"]},
                    {"$set": {"player2_id": winner_id, "updated_at": datetime.utcnow()}}
                )
        
        # Check if tournament is complete
        await check_tournament_completion(tournament_id)
        
    except Exception as e:
        logger.error(f"Error updating next round match: {str(e)}")

async def check_tournament_completion(tournament_id: str):
    """Check if tournament is complete and update winner."""
    try:
        # Find the final match (highest round number)
        final_match = await db.matches.find_one(
            {"tournament_id": tournament_id, "status": MatchStatus.COMPLETED},
            sort=[("round_number", -1)]
        )
        
        if final_match:
            # Check if this is the last match
            remaining_matches = await db.matches.count_documents({
                "tournament_id": tournament_id,
                "status": {"$ne": MatchStatus.COMPLETED}
            })
            
            if remaining_matches == 0:
                # Tournament is complete
                await db.tournaments.update_one(
                    {"id": tournament_id},
                    {
                        "$set": {
                            "status": "completed",
                            "winner_id": final_match["winner_id"],
                            "tournament_end": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                logger.info(f"Tournament {tournament_id} completed - Winner: {final_match['winner_id']}")
        
    except Exception as e:
        logger.error(f"Error checking tournament completion: {str(e)}")

@router.get("/tournament/{tournament_id}/bracket")
async def get_tournament_bracket(tournament_id: str):
    """Get tournament bracket structure."""
    try:
        # Get all matches for the tournament
        matches = await db.matches.find(
            {"tournament_id": tournament_id}
        ).sort("round_number", 1).to_list(100)
        
        if not matches:
            return {"rounds": [], "tournament_status": "no_bracket"}

        # Organize matches by rounds
        rounds = {}
        for match_data in matches:
            match = Match(**match_data)
            round_num = match.round_number
            
            if round_num not in rounds:
                rounds[round_num] = []
            
            rounds[round_num].append(match.dict())

        # Get tournament info
        tournament = await db.tournaments.find_one({"id": tournament_id})
        tournament_status = tournament["status"] if tournament else "unknown"

        return {
            "rounds": [{"round_number": k, "matches": v} for k, v in sorted(rounds.items())],
            "tournament_status": tournament_status
        }
        
    except Exception as e:
        logger.error(f"Error getting tournament bracket: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching tournament bracket"
        )

@router.get("/{match_id}", response_model=Match)
async def get_match(match_id: str):
    """Get a specific match."""
    try:
        match_data = await db.matches.find_one({"id": match_id})
        if not match_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )
        
        return Match(**match_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting match {match_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching match"
        )