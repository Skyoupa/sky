#!/usr/bin/env python3
import asyncio
import motor.motor_asyncio
from datetime import datetime

async def add_test_participants():
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
        db = client.oupafamilly
        
        # Check current tournament
        tournament = await db.tournaments.find_one({'id': '5b8ed110-f9ba-44d9-a9b1-07e1f14b613a'})
        if not tournament:
            print("❌ Tournament not found")
            return
            
        current_participants = tournament.get('participants', [])
        print(f"Current participants: {len(current_participants)}")
        
        # Add test participants
        new_participants = [
            'test-player-001',
            'test-player-002', 
            'test-player-003'
        ]
        
        # Update with new participants list
        all_participants = current_participants + new_participants
        
        result = await db.tournaments.update_one(
            {'id': '5b8ed110-f9ba-44d9-a9b1-07e1f14b613a'},
            {'$set': {'participants': all_participants, 'updated_at': datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Successfully added {len(new_participants)} test participants")
            print(f"Total participants now: {len(all_participants)}")
        else:
            print("❌ Failed to update tournament")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(add_test_participants())