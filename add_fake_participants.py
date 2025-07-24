#!/usr/bin/env python3
import asyncio
import motor.motor_asyncio
from datetime import datetime
import uuid

async def add_fake_participants():
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
        db = client.oupafamilly
        
        tournament_id = 'bf82e00c-fe1f-4d06-82de-a55e5f6dd43f'
        
        # Get current tournament
        tournament = await db.tournaments.find_one({'id': tournament_id})
        if not tournament:
            print("❌ Tournament not found")
            return
            
        current_participants = tournament.get('participants', [])
        print(f"Current participants: {len(current_participants)}")
        
        # Add fake participant IDs (simulate 5 more players)
        fake_participants = [str(uuid.uuid4()) for _ in range(5)]
        all_participants = current_participants + fake_participants
        
        # Update tournament
        result = await db.tournaments.update_one(
            {'id': tournament_id},
            {'$set': {'participants': all_participants, 'updated_at': datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Added {len(fake_participants)} fake participants")
            print(f"Total participants now: {len(all_participants)}")
            print("Ready for bracket generation!")
        else:
            print("❌ Failed to update tournament")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(add_fake_participants())