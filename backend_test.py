#!/usr/bin/env python3
"""
Comprehensive backend testing for Oupafamilly community platform.
Tests all backend APIs and functionality for a growing multigaming community.
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

# Get backend URL from frontend environment
FRONTEND_ENV_PATH = "/app/frontend/.env"
BACKEND_URL = None

def get_backend_url():
    """Get backend URL from frontend .env file"""
    global BACKEND_URL
    if BACKEND_URL:
        return BACKEND_URL
    
    # For testing, use local backend URL since external URL might not be accessible
    return "http://localhost:8001/api"

BASE_URL = get_backend_url()

class OupafamillyTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = None
        self.admin_token = None
        self.test_user_token = None
        self.test_results = []
        
        # Test data for realistic community testing
        self.admin_credentials = {
            "email": "admin@oupafamilly.com",
            "password": "Oupafamilly2024!"
        }
        
        self.test_user_data = {
            "username": "gamer_alex",
            "email": "alex.martin@example.com", 
            "password": "Gaming2024!",
            "display_name": "Alex Martin"
        }
        
        self.test_tournament_data = {
            "title": "Tournoi CS2 Communauté",
            "description": "Premier tournoi Counter-Strike 2 de la communauté Oupafamilly",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 16,
            "entry_fee": 0.0,
            "prize_pool": 100.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "Format BO1 jusqu'aux demi-finales, BO3 pour la finale. Maps: Mirage, Inferno, Dust2."
        }
        
        self.test_news_data = {
            "title": "Nouvelle mise à jour de la communauté",
            "content": "Nous sommes ravis d'annoncer les nouvelles fonctionnalités de notre plateforme communautaire!",
            "summary": "Annonce des nouvelles fonctionnalités",
            "tags": ["update", "community"],
            "is_pinned": False
        }
        
        self.test_tutorial_data = {
            "title": "Guide débutant CS2",
            "description": "Apprenez les bases de Counter-Strike 2",
            "game": "cs2",
            "level": "beginner",
            "content": "Ce tutoriel couvre les mécaniques de base de CS2: mouvement, visée, économie...",
            "tags": ["cs2", "beginner", "guide"]
        }

    async def setup_session(self):
        """Setup HTTP session"""
        self.session = aiohttp.ClientSession()

    async def cleanup_session(self):
        """Cleanup HTTP session"""
        if self.session:
            await self.session.close()

    def log_test(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        })

    async def make_request(self, method: str, endpoint: str, data: Dict = None, 
                          headers: Dict = None, auth_token: str = None) -> tuple:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        
        request_headers = {"Content-Type": "application/json"}
        if headers:
            request_headers.update(headers)
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        try:
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                return response.status, response_data
                
        except Exception as e:
            return 0, {"error": str(e)}

    async def test_server_health(self):
        """Test server health and basic endpoints"""
        print("\n🏥 Testing Server Health...")
        
        # Test health endpoint
        status, data = await self.make_request("GET", "/health")
        if status == 200 and data.get("status") == "healthy":
            self.log_test("Health Check", True, "Server is healthy and database connected")
        else:
            self.log_test("Health Check", False, f"Health check failed: {data}")
        
        # Test root endpoint
        status, data = await self.make_request("GET", "/")
        if status == 200 and "Oupafamilly" in data.get("message", ""):
            self.log_test("Root Endpoint", True, "API root endpoint working")
        else:
            self.log_test("Root Endpoint", False, f"Root endpoint failed: {data}")

    async def test_authentication_system(self):
        """Test complete authentication system"""
        print("\n🔐 Testing Authentication System...")
        
        # Test admin login
        status, data = await self.make_request("POST", "/auth/login", self.admin_credentials)
        if status == 200 and "access_token" in data:
            self.admin_token = data["access_token"]
            self.log_test("Admin Login", True, "Admin login successful")
        else:
            self.log_test("Admin Login", False, f"Admin login failed: {data}")
            return
        
        # Test get current user (admin)
        status, data = await self.make_request("GET", "/auth/me", auth_token=self.admin_token)
        if status == 200 and data.get("role") == "admin":
            self.log_test("Get Current User", True, f"Retrieved admin user: {data.get('username')}")
        else:
            self.log_test("Get Current User", False, f"Failed to get current user: {data}")
        
        # Test user registration
        status, data = await self.make_request("POST", "/auth/register", self.test_user_data)
        if status == 200 and data.get("username") == self.test_user_data["username"]:
            self.log_test("User Registration", True, f"User registered: {data.get('username')}")
        else:
            self.log_test("User Registration", False, f"Registration failed: {data}")
        
        # Test new user login
        login_data = {
            "email": self.test_user_data["email"],
            "password": self.test_user_data["password"]
        }
        status, data = await self.make_request("POST", "/auth/login", login_data)
        if status == 200 and "access_token" in data:
            self.test_user_token = data["access_token"]
            self.log_test("User Login", True, "New user login successful")
        else:
            self.log_test("User Login", False, f"User login failed: {data}")
        
        # Test user profile
        if self.test_user_token:
            status, data = await self.make_request("GET", "/auth/profile", auth_token=self.test_user_token)
            if status == 200 and data.get("display_name"):
                self.log_test("User Profile", True, f"Retrieved profile: {data.get('display_name')}")
            else:
                self.log_test("User Profile", False, f"Failed to get profile: {data}")
        
        # Test auth stats (admin only)
        status, data = await self.make_request("GET", "/auth/stats", auth_token=self.admin_token)
        if status == 200 and "total_users" in data:
            self.log_test("Auth Statistics", True, f"Total users: {data.get('total_users')}")
        else:
            self.log_test("Auth Statistics", False, f"Failed to get auth stats: {data}")

    async def test_tournament_system(self):
        """Test tournament management system"""
        print("\n🏆 Testing Tournament System...")
        
        if not self.admin_token:
            self.log_test("Tournament System", False, "No admin token available")
            return
        
        # Test tournament creation
        status, data = await self.make_request("POST", "/tournaments/", 
                                              self.test_tournament_data, 
                                              auth_token=self.admin_token)
        tournament_id = None
        if status == 200 and data.get("id"):
            tournament_id = data["id"]
            self.log_test("Tournament Creation", True, f"Tournament created: {data.get('title')}")
        else:
            self.log_test("Tournament Creation", False, f"Failed to create tournament: {data}")
        
        # Test get tournaments
        status, data = await self.make_request("GET", "/tournaments/")
        if status == 200 and isinstance(data, list):
            self.log_test("Get Tournaments", True, f"Retrieved {len(data)} tournaments")
        else:
            self.log_test("Get Tournaments", False, f"Failed to get tournaments: {data}")
        
        # Test tournament details
        if tournament_id:
            status, data = await self.make_request("GET", f"/tournaments/{tournament_id}")
            if status == 200 and data.get("id") == tournament_id:
                self.log_test("Tournament Details", True, f"Retrieved tournament: {data.get('title')}")
            else:
                self.log_test("Tournament Details", False, f"Failed to get tournament details: {data}")
        
        # Test tournament stats
        status, data = await self.make_request("GET", "/tournaments/stats/community")
        if status == 200 and "total_tournaments" in data:
            self.log_test("Tournament Stats", True, f"Total tournaments: {data.get('total_tournaments')}")
        else:
            self.log_test("Tournament Stats", False, f"Failed to get tournament stats: {data}")
        
        # Test popular templates
        status, data = await self.make_request("GET", "/tournaments/templates/popular")
        if status == 200 and "templates" in data:
            self.log_test("Tournament Templates", True, f"Retrieved {len(data['templates'])} templates")
        else:
            self.log_test("Tournament Templates", False, f"Failed to get templates: {data}")
        
        # Test tournament registration (if we have a test user)
        if tournament_id and self.test_user_token:
            # First update tournament status to open
            status, _ = await self.make_request("PUT", f"/tournaments/{tournament_id}/status?new_status=open", 
                                              auth_token=self.admin_token)
            
            # Try to register
            status, data = await self.make_request("POST", f"/tournaments/{tournament_id}/register", 
                                                  auth_token=self.test_user_token)
            if status == 200:
                self.log_test("Tournament Registration", True, "User registered for tournament")
            else:
                self.log_test("Tournament Registration", False, f"Registration failed: {data}")

    async def test_content_management(self):
        """Test content management system"""
        print("\n📰 Testing Content Management...")
        
        if not self.admin_token:
            self.log_test("Content Management", False, "No admin token available")
            return
        
        # Test news creation
        status, data = await self.make_request("POST", "/content/news", 
                                              self.test_news_data, 
                                              auth_token=self.admin_token)
        news_id = None
        if status == 200 and data.get("id"):
            news_id = data["id"]
            self.log_test("News Creation", True, f"News created: {data.get('title')}")
        else:
            self.log_test("News Creation", False, f"Failed to create news: {data}")
        
        # Test get news
        status, data = await self.make_request("GET", "/content/news")
        if status == 200 and isinstance(data, list):
            self.log_test("Get News", True, f"Retrieved {len(data)} news articles")
        else:
            self.log_test("Get News", False, f"Failed to get news: {data}")
        
        # Test news details
        if news_id:
            status, data = await self.make_request("GET", f"/content/news/{news_id}")
            if status == 200 and data.get("id") == news_id:
                self.log_test("News Details", True, f"Retrieved news: {data.get('title')}")
            else:
                self.log_test("News Details", False, f"Failed to get news details: {data}")
        
        # Test tutorial creation (any user can create)
        if self.test_user_token:
            status, data = await self.make_request("POST", "/content/tutorials", 
                                                  self.test_tutorial_data, 
                                                  auth_token=self.test_user_token)
            tutorial_id = None
            if status == 200 and data.get("id"):
                tutorial_id = data["id"]
                self.log_test("Tutorial Creation", True, f"Tutorial created: {data.get('title')}")
            else:
                self.log_test("Tutorial Creation", False, f"Failed to create tutorial: {data}")
            
            # Test tutorial like
            if tutorial_id:
                status, data = await self.make_request("POST", f"/content/tutorials/{tutorial_id}/like", 
                                                      auth_token=self.test_user_token)
                if status == 200:
                    self.log_test("Tutorial Like", True, "Tutorial liked successfully")
                else:
                    self.log_test("Tutorial Like", False, f"Failed to like tutorial: {data}")
        
        # Test get tutorials
        status, data = await self.make_request("GET", "/content/tutorials")
        if status == 200 and isinstance(data, list):
            self.log_test("Get Tutorials", True, f"Retrieved {len(data)} tutorials")
        else:
            self.log_test("Get Tutorials", False, f"Failed to get tutorials: {data}")
        
        # Test tutorials by game
        status, data = await self.make_request("GET", "/content/tutorials/by-game/cs2")
        if status == 200 and "tutorials_by_level" in data:
            self.log_test("Tutorials by Game", True, f"Retrieved CS2 tutorials by level")
        else:
            self.log_test("Tutorials by Game", False, f"Failed to get tutorials by game: {data}")
        
        # Test content stats
        status, data = await self.make_request("GET", "/content/stats/content", 
                                              auth_token=self.admin_token)
        if status == 200 and "news" in data and "tutorials" in data:
            self.log_test("Content Statistics", True, f"News: {data['news']['total']}, Tutorials: {data['tutorials']['total']}")
        else:
            self.log_test("Content Statistics", False, f"Failed to get content stats: {data}")
        
        # Test welcome content
        status, data = await self.make_request("GET", "/content/welcome/new-member")
        if status == 200 and "welcome_message" in data:
            self.log_test("Welcome Content", True, "Welcome content retrieved successfully")
        else:
            self.log_test("Welcome Content", False, f"Failed to get welcome content: {data}")

    async def test_admin_dashboard(self):
        """Test admin dashboard and management features"""
        print("\n👑 Testing Admin Dashboard...")
        
        if not self.admin_token:
            self.log_test("Admin Dashboard", False, "No admin token available")
            return
        
        # Test admin dashboard
        status, data = await self.make_request("GET", "/admin/dashboard", 
                                              auth_token=self.admin_token)
        if status == 200 and "community_overview" in data:
            overview = data["community_overview"]
            self.log_test("Admin Dashboard", True, 
                         f"Members: {overview.get('total_members')}, Active: {overview.get('active_members')}")
        else:
            self.log_test("Admin Dashboard", False, f"Failed to get dashboard: {data}")
        
        # Test get all users
        status, data = await self.make_request("GET", "/admin/users", 
                                              auth_token=self.admin_token)
        if status == 200 and isinstance(data, list):
            self.log_test("Get All Users", True, f"Retrieved {len(data)} users")
        else:
            self.log_test("Get All Users", False, f"Failed to get users: {data}")
        
        # Test community growth stats
        status, data = await self.make_request("GET", "/admin/community-growth", 
                                              auth_token=self.admin_token)
        if status == 200 and "summary" in data:
            summary = data["summary"]
            self.log_test("Community Growth", True, 
                         f"New users: {summary.get('total_new_users')}, Retention: {summary.get('retention_rate')}%")
        else:
            self.log_test("Community Growth", False, f"Failed to get growth stats: {data}")
        
        # Test broadcast announcement
        announcement_data = {
            "title": "Test d'annonce",
            "message": "Ceci est un test d'annonce pour la communauté Oupafamilly!"
        }
        status, data = await self.make_request("POST", "/admin/announcements/broadcast", 
                                              announcement_data, 
                                              auth_token=self.admin_token)
        if status == 200 and data.get("announcement_id"):
            self.log_test("Broadcast Announcement", True, f"Announcement broadcasted: {data.get('title')}")
        else:
            self.log_test("Broadcast Announcement", False, f"Failed to broadcast: {data}")
        
        # Test moderation reports
        status, data = await self.make_request("GET", "/admin/moderation/reports", 
                                              auth_token=self.admin_token)
        if status == 200 and "pending_users" in data:
            self.log_test("Moderation Reports", True, 
                         f"Pending users: {len(data.get('pending_users', []))}")
        else:
            self.log_test("Moderation Reports", False, f"Failed to get moderation reports: {data}")

    async def test_protected_endpoints(self):
        """Test that protected endpoints require authentication"""
        print("\n🔒 Testing Protected Endpoints...")
        
        # Test accessing protected endpoint without token
        status, data = await self.make_request("GET", "/auth/me")
        if status == 401:
            self.log_test("Protected Endpoint Security", True, "Unauthorized access properly blocked")
        else:
            self.log_test("Protected Endpoint Security", False, f"Security issue: {status} - {data}")
        
        # Test admin endpoint with regular user token
        if self.test_user_token:
            status, data = await self.make_request("GET", "/admin/dashboard", 
                                                  auth_token=self.test_user_token)
            if status == 403:
                self.log_test("Admin Access Control", True, "Non-admin access properly blocked")
            else:
                self.log_test("Admin Access Control", False, f"Access control issue: {status} - {data}")

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("🎯 OUPAFAMILLY BACKEND TEST SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"📊 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📈 Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        print(f"\n🌐 Backend URL: {self.base_url}")
        print(f"⏰ Test completed at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC")
        
        return passed_tests, failed_tests

    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Oupafamilly Backend Tests...")
        print(f"🌐 Testing backend at: {self.base_url}")
        
        await self.setup_session()
        
        try:
            # Run all test suites
            await self.test_server_health()
            await self.test_authentication_system()
            await self.test_tournament_system()
            await self.test_content_management()
            await self.test_admin_dashboard()
            await self.test_protected_endpoints()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {e}")
            self.log_test("Critical Error", False, str(e))
        
        finally:
            await self.cleanup_session()
        
        return self.print_summary()

async def main():
    """Main test function"""
    tester = OupafamillyTester()
    passed, failed = await tester.run_all_tests()
    
    # Exit with appropriate code
    exit_code = 0 if failed == 0 else 1
    print(f"\n🏁 Tests completed with exit code: {exit_code}")
    return exit_code

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)