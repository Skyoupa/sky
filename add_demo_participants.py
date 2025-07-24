#!/usr/bin/env python3
import asyncio
import motor.motor_asyncio
from datetime import datetime

async def add_demo_participants():
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
        db = client.oupafamilly
        
        tournament_id = 'bf82e00c-fe1f-4d06-82de-a55e5f6dd43f'
        
        # Create demo participants
        demo_participants = [
            'admin-user-001',  # Admin as first participant
            'team-legends-cs2',
            'pro-gamers-elite', 
            'dragons-esport',
            'phoenix-squad',
            'lightning-crew'
        ]
        
        # Update tournament with demo participants
        result = await db.tournaments.update_one(
            {'id': tournament_id},
            {'$set': {'participants': demo_participants, 'updated_at': datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Successfully added {len(demo_participants)} demo participants")
            print("Demo participants:")
            for i, participant in enumerate(demo_participants, 1):
                print(f"  {i}. {participant}")
        else:
            print("❌ Failed to update tournament")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(add_demo_participants())