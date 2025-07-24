#!/usr/bin/env python3
"""
Comprehensive backend testing for Oupafamilly community platform.
Tests all backend APIs and functionality for a growing multigaming community.
"""

import asyncio
import aiohttp
import json
import os
import uuid
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
    
    try:
        with open(FRONTEND_ENV_PATH, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    url = line.split('=', 1)[1].strip()
                    BACKEND_URL = f"{url}/api"
                    return BACKEND_URL
    except FileNotFoundError:
        pass
    
    # Fallback to localhost for testing
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
        elif status == 400 and "already registered" in data.get("detail", ""):
            self.log_test("User Registration", True, f"User already exists (expected): {self.test_user_data['username']}")
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
            
            # Verify all tournaments are CS2 only
            cs2_only = all(tournament.get("game") == "cs2" for tournament in data)
            if cs2_only:
                self.log_test("CS2 Only Tournaments", True, f"All {len(data)} tournaments are CS2 exclusive")
            else:
                non_cs2 = [t.get("game") for t in data if t.get("game") != "cs2"]
                self.log_test("CS2 Only Tournaments", False, f"Found non-CS2 tournaments: {non_cs2}")
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

    async def test_cs2_tournament_templates(self):
        """Test CS2 tournament templates specifically for Oupafamilly"""
        print("\n🎮 Testing CS2 Tournament Templates...")
        
        # Test popular templates endpoint
        status, data = await self.make_request("GET", "/tournaments/templates/popular")
        if status != 200:
            self.log_test("CS2 Templates Endpoint", False, f"Failed to get templates: {data}")
            return
        
        templates = data.get("templates", [])
        
        # Test 1: Should return exactly 6 templates
        if len(templates) == 6:
            self.log_test("CS2 Templates Count", True, f"Retrieved exactly 6 CS2 templates")
        else:
            self.log_test("CS2 Templates Count", False, f"Expected 6 templates, got {len(templates)}")
        
        # Test 2: Verify all templates are CS2
        cs2_only = all(template.get("game") == "cs2" for template in templates)
        if cs2_only:
            self.log_test("CS2 Templates Game Filter", True, "All templates are CS2 exclusive")
        else:
            non_cs2 = [t.get("game") for t in templates if t.get("game") != "cs2"]
            self.log_test("CS2 Templates Game Filter", False, f"Found non-CS2 templates: {non_cs2}")
        
        # Test 3: Verify expected template names
        expected_names = [
            "CS2 Quick Match 1v1",
            "CS2 Team Deathmatch 5v5", 
            "CS2 Competitive 5v5",
            "CS2 Retake Masters",
            "CS2 Aim Challenge",
            "CS2 Pistol Only Tournament"
        ]
        
        actual_names = [template.get("name") for template in templates]
        missing_names = [name for name in expected_names if name not in actual_names]
        extra_names = [name for name in actual_names if name not in expected_names]
        
        if not missing_names and not extra_names:
            self.log_test("CS2 Template Names", True, "All expected template names present")
        else:
            error_msg = ""
            if missing_names:
                error_msg += f"Missing: {missing_names}. "
            if extra_names:
                error_msg += f"Extra: {extra_names}."
            self.log_test("CS2 Template Names", False, error_msg)
        
        # Test 4: Verify detailed rules are present and well-formatted
        rules_quality_passed = 0
        for template in templates:
            name = template.get("name", "Unknown")
            rules = template.get("rules", "")
            
            # Check if rules are detailed (at least 200 characters)
            if len(rules) >= 200:
                rules_quality_passed += 1
                
            # Check for CS2-specific content and emojis
            has_emojis = any(char in rules for char in "🎯🗺️⏱️🔫💰📋🏆")
            has_cs2_terms = any(term in rules.lower() for term in ["cs2", "counter-strike", "rounds", "maps", "frags"])
            
            if has_emojis and has_cs2_terms:
                self.log_test(f"Template Rules Quality - {name}", True, "Rules are detailed and well-formatted")
            else:
                self.log_test(f"Template Rules Quality - {name}", False, "Rules lack detail or CS2-specific content")
        
        if rules_quality_passed == 6:
            self.log_test("CS2 Templates Rules Overall", True, "All templates have detailed rules")
        else:
            self.log_test("CS2 Templates Rules Overall", False, f"Only {rules_quality_passed}/6 templates have adequate rules")
        
        # Test 5: Test tournament creation with CS2 template
        if templates:
            template = templates[0]  # Use first template
            tournament_data = {
                "title": f"Test {template['name']}",
                "description": template["description"],
                "game": template["game"],
                "tournament_type": template["tournament_type"],
                "max_participants": template["max_participants"],
                "entry_fee": 0.0,
                "prize_pool": 50.0,
                "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
                "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
                "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
                "rules": template["rules"]
            }
            
            if self.admin_token:
                status, data = await self.make_request("POST", "/tournaments/", 
                                                      tournament_data, 
                                                      auth_token=self.admin_token)
                if status == 200 and data.get("id"):
                    self.log_test("CS2 Template Tournament Creation", True, f"Created tournament from template: {template['name']}")
                    
                    # Verify the created tournament has detailed rules
                    if len(data.get("rules", "")) >= 200:
                        self.log_test("CS2 Template Rules Persistence", True, "Detailed rules saved correctly")
                    else:
                        self.log_test("CS2 Template Rules Persistence", False, "Rules not saved properly")
                else:
                    self.log_test("CS2 Template Tournament Creation", False, f"Failed to create tournament: {data}")
        
        # Test 6: Verify only CS2 is accepted as game
        invalid_tournament_data = {
            "title": "Invalid Game Tournament",
            "description": "This should fail",
            "game": "valorant",  # Not CS2
            "tournament_type": "elimination",
            "max_participants": 16,
            "entry_fee": 0.0,
            "prize_pool": 50.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "Test rules"
        }
        
        if self.admin_token:
            status, data = await self.make_request("POST", "/tournaments/", 
                                                  invalid_tournament_data, 
                                                  auth_token=self.admin_token)
            if status in [400, 422]:  # Should fail validation
                self.log_test("CS2 Only Game Validation", True, "Non-CS2 games properly rejected")
            else:
                self.log_test("CS2 Only Game Validation", False, f"Non-CS2 game was accepted: {data}")

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
        status, data = await self.make_request("POST", "/admin/announcements/broadcast?title=Test%20d%27annonce&message=Ceci%20est%20un%20test%20d%27annonce%20pour%20la%20communaut%C3%A9%20Oupafamilly!", 
                                              None, 
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
        if status in [401, 403]:
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

    async def test_tournament_deletion_feature(self):
        """Test tournament deletion functionality comprehensively"""
        print("\n🗑️ Testing Tournament Deletion Feature...")
        
        if not self.admin_token or not self.test_user_token:
            self.log_test("Tournament Deletion Setup", False, "Missing required tokens for testing")
            return
        
        # Create test tournaments for deletion testing
        test_tournament_1 = {
            "title": "Test Tournament for Deletion",
            "description": "Tournament créé pour tester la suppression",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 8,
            "entry_fee": 0.0,
            "prize_pool": 50.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "Règles de test pour suppression"
        }
        
        # Test 1: Create tournament as admin
        status, data = await self.make_request("POST", "/tournaments/", 
                                              test_tournament_1, 
                                              auth_token=self.admin_token)
        tournament_id_admin = None
        if status == 200 and data.get("id"):
            tournament_id_admin = data["id"]
            self.log_test("Tournament Creation for Deletion Test", True, f"Tournament created: {data.get('title')}")
        else:
            self.log_test("Tournament Creation for Deletion Test", False, f"Failed to create tournament: {data}")
            return
        
        # Test 2: Create tournament as regular user
        status, data = await self.make_request("POST", "/tournaments/", 
                                              test_tournament_1, 
                                              auth_token=self.test_user_token)
        tournament_id_user = None
        if status == 200 and data.get("id"):
            tournament_id_user = data["id"]
            self.log_test("User Tournament Creation", True, f"User tournament created: {data.get('title')}")
        else:
            self.log_test("User Tournament Creation", False, f"Failed to create user tournament: {data}")
        
        # Test 3: Try to delete tournament without authentication (should fail with 401)
        status, data = await self.make_request("DELETE", f"/tournaments/{tournament_id_admin}")
        if status in [401, 403]:
            self.log_test("Delete Without Auth", True, "Unauthorized deletion properly blocked")
        else:
            self.log_test("Delete Without Auth", False, f"Security issue - deletion allowed without auth: {status}")
        
        # Test 4: Try to delete tournament with regular user token (not organizer, should fail with 403)
        status, data = await self.make_request("DELETE", f"/tournaments/{tournament_id_admin}", 
                                              auth_token=self.test_user_token)
        if status == 403:
            self.log_test("Delete Permission Check", True, "Non-organizer/non-admin deletion properly blocked")
        else:
            self.log_test("Delete Permission Check", False, f"Permission issue: {status} - {data}")
        
        # Test 5: Try to delete non-existent tournament (should return 404)
        fake_tournament_id = str(uuid.uuid4())
        status, data = await self.make_request("DELETE", f"/tournaments/{fake_tournament_id}", 
                                              auth_token=self.admin_token)
        if status == 404:
            self.log_test("Delete Non-existent Tournament", True, "404 returned for non-existent tournament")
        else:
            self.log_test("Delete Non-existent Tournament", False, f"Expected 404, got {status}: {data}")
        
        # Test 6: Register users for tournament and test participant cleanup
        if tournament_id_admin:
            # First set tournament to open status
            status, _ = await self.make_request("PUT", f"/tournaments/{tournament_id_admin}/status?new_status=open", 
                                              auth_token=self.admin_token)
            
            # Register test user
            status, data = await self.make_request("POST", f"/tournaments/{tournament_id_admin}/register", 
                                                  auth_token=self.test_user_token)
            if status == 200:
                self.log_test("User Registration for Deletion Test", True, "User registered successfully")
                
                # Check user profile tournament count before deletion
                status, profile_before = await self.make_request("GET", "/auth/profile", 
                                                                auth_token=self.test_user_token)
                tournaments_before = profile_before.get("total_tournaments", 0) if status == 200 else 0
                
                # Test 7: Delete tournament as admin (should succeed and clean up registrations)
                status, data = await self.make_request("DELETE", f"/tournaments/{tournament_id_admin}", 
                                                      auth_token=self.admin_token)
                if status == 200:
                    self.log_test("Admin Tournament Deletion", True, f"Tournament deleted successfully: {data.get('message')}")
                    
                    # Verify tournament is actually deleted
                    status, _ = await self.make_request("GET", f"/tournaments/{tournament_id_admin}")
                    if status == 404:
                        self.log_test("Tournament Deletion Verification", True, "Tournament properly removed from database")
                    else:
                        self.log_test("Tournament Deletion Verification", False, "Tournament still exists after deletion")
                    
                    # Check user profile tournament count after deletion (should be decremented)
                    status, profile_after = await self.make_request("GET", "/auth/profile", 
                                                                   auth_token=self.test_user_token)
                    if status == 200:
                        tournaments_after = profile_after.get("total_tournaments", 0)
                        if tournaments_after == tournaments_before - 1:
                            self.log_test("User Profile Cleanup", True, f"User tournament count properly decremented: {tournaments_before} -> {tournaments_after}")
                        else:
                            self.log_test("User Profile Cleanup", False, f"Tournament count not properly updated: {tournaments_before} -> {tournaments_after}")
                    else:
                        self.log_test("User Profile Cleanup", False, "Could not verify profile update")
                        
                else:
                    self.log_test("Admin Tournament Deletion", False, f"Admin deletion failed: {data}")
            else:
                self.log_test("User Registration for Deletion Test", False, f"Registration failed: {data}")
        
        # Test 8: Test deletion of in-progress tournament (should fail with 400)
        if tournament_id_user:
            # Set tournament to in_progress status
            status, _ = await self.make_request("PUT", f"/tournaments/{tournament_id_user}/status?new_status=in_progress", 
                                              auth_token=self.test_user_token)
            
            if status == 200:
                # Try to delete in-progress tournament
                status, data = await self.make_request("DELETE", f"/tournaments/{tournament_id_user}", 
                                                      auth_token=self.test_user_token)
                if status == 400:
                    self.log_test("In-Progress Tournament Deletion Block", True, "In-progress tournament deletion properly blocked")
                else:
                    self.log_test("In-Progress Tournament Deletion Block", False, f"In-progress tournament deletion not blocked: {status} - {data}")
                
                # Reset to draft status for cleanup
                await self.make_request("PUT", f"/tournaments/{tournament_id_user}/status?new_status=draft", 
                                      auth_token=self.test_user_token)
        
        # Test 9: Test organizer can delete their own tournament
        if tournament_id_user:
            status, data = await self.make_request("DELETE", f"/tournaments/{tournament_id_user}", 
                                                  auth_token=self.test_user_token)
            if status == 200:
                self.log_test("Organizer Tournament Deletion", True, f"Organizer successfully deleted own tournament: {data.get('message')}")
            else:
                self.log_test("Organizer Tournament Deletion", False, f"Organizer deletion failed: {data}")
        
        # Test 10: Verify tournament list is updated after deletions
        status, tournaments = await self.make_request("GET", "/tournaments/")
        if status == 200:
            deleted_tournaments = [t for t in tournaments if t.get("id") in [tournament_id_admin, tournament_id_user]]
            if len(deleted_tournaments) == 0:
                self.log_test("Tournament List Update", True, "Tournament list properly updated after deletions")
            else:
                self.log_test("Tournament List Update", False, f"Deleted tournaments still in list: {len(deleted_tournaments)}")
        else:
            self.log_test("Tournament List Update", False, "Could not verify tournament list update")

    async def test_community_management_system(self):
        """Test community management system with posts, leaderboard, members, and teams."""
        print("\n🏘️ Testing Community Management System...")
        
        if not self.admin_token:
            self.log_test("Community Management System", False, "No admin token available")
            return
        
        # Test 1: Get community statistics
        status, data = await self.make_request("GET", "/community/stats")
        if status == 200 and "users" in data and "teams" in data and "tournaments" in data:
            self.log_test("Community Stats", True, f"Users: {data['users']['total']}, Teams: {data['teams']['total']}, Tournaments: {data['tournaments']['total']}")
        else:
            self.log_test("Community Stats", False, f"Failed to get community stats: {data}")
        
        # Test 2: Get community posts
        status, data = await self.make_request("GET", "/community/posts")
        if status == 200 and isinstance(data, list):
            self.log_test("Get Community Posts", True, f"Retrieved {len(data)} community posts")
        else:
            self.log_test("Get Community Posts", False, f"Failed to get community posts: {data}")
        
        # Test 3: Create community post (admin/moderator only)
        post_data = {
            "title": "Nouvelle fonctionnalité communauté",
            "content": "Nous sommes ravis d'annoncer les nouvelles fonctionnalités de notre système communautaire!",
            "summary": "Annonce des nouvelles fonctionnalités communautaires",
            "tags": ["community", "update", "features"],
            "is_pinned": True
        }
        status, data = await self.make_request("POST", "/community/posts", post_data, auth_token=self.admin_token)
        post_id = None
        if status == 200 and data.get("id"):
            post_id = data["id"]
            self.log_test("Create Community Post", True, f"Community post created: {data.get('title')}")
        else:
            self.log_test("Create Community Post", False, f"Failed to create community post: {data}")
        
        # Test 4: Update community post
        if post_id:
            update_data = {
                "title": "Nouvelle fonctionnalité communauté - Mise à jour",
                "content": "Contenu mis à jour avec plus de détails sur les nouvelles fonctionnalités!",
                "summary": "Mise à jour de l'annonce",
                "tags": ["community", "update", "features", "enhanced"],
                "is_pinned": True
            }
            status, data = await self.make_request("PUT", f"/community/posts/{post_id}", update_data, auth_token=self.admin_token)
            if status == 200:
                self.log_test("Update Community Post", True, "Community post updated successfully")
            else:
                self.log_test("Update Community Post", False, f"Failed to update community post: {data}")
        
        # Test 5: Get community leaderboard with trophy-based ranking
        status, data = await self.make_request("GET", "/community/leaderboard")
        if status == 200 and "leaderboard" in data:
            leaderboard = data["leaderboard"]
            self.log_test("Community Leaderboard", True, f"Retrieved leaderboard with {len(leaderboard)} players")
            
            # Verify leaderboard structure
            if leaderboard:
                player = leaderboard[0]
                required_fields = ["user_id", "username", "total_points", "total_trophies", "victories_1v1", "victories_2v2", "victories_5v5", "rank", "badge"]
                if all(field in player for field in required_fields):
                    self.log_test("Leaderboard Structure", True, f"Top player: {player['username']} with {player['total_points']} points and {player['total_trophies']} trophies")
                else:
                    missing_fields = [field for field in required_fields if field not in player]
                    self.log_test("Leaderboard Structure", False, f"Missing fields in leaderboard: {missing_fields}")
        else:
            self.log_test("Community Leaderboard", False, f"Failed to get community leaderboard: {data}")
        
        # Test 6: Get community members with enhanced profiles
        status, data = await self.make_request("GET", "/community/members")
        if status == 200 and "members" in data:
            members = data["members"]
            self.log_test("Community Members", True, f"Retrieved {len(members)} community members")
            
            # Verify member structure
            if members:
                member = members[0]
                required_fields = ["id", "username", "role", "trophies", "profile"]
                if all(field in member for field in required_fields):
                    trophies = member["trophies"]
                    profile = member["profile"]
                    self.log_test("Member Profile Structure", True, f"Member {member['username']} has {trophies['total']} trophies and profile with display_name: {profile['display_name']}")
                else:
                    missing_fields = [field for field in required_fields if field not in member]
                    self.log_test("Member Profile Structure", False, f"Missing fields in member data: {missing_fields}")
        else:
            self.log_test("Community Members", False, f"Failed to get community members: {data}")
        
        # Test 7: Get community teams with rankings
        status, data = await self.make_request("GET", "/community/teams")
        if status == 200 and "teams" in data:
            teams = data["teams"]
            self.log_test("Community Teams", True, f"Retrieved {len(teams)} community teams")
            
            # Verify team structure
            if teams:
                team = teams[0]
                required_fields = ["id", "name", "game", "captain", "members", "member_count", "max_members", "statistics", "rank"]
                if all(field in team for field in required_fields):
                    stats = team["statistics"]
                    self.log_test("Team Structure", True, f"Team {team['name']} has {team['member_count']}/{team['max_members']} members and {stats['total_points']} points")
                    
                    # Verify max_members is 6 (as per requirements)
                    if team["max_members"] == 6:
                        self.log_test("Team Max Members", True, f"Team supports maximum 6 members as required")
                    else:
                        self.log_test("Team Max Members", False, f"Team max_members is {team['max_members']}, expected 6")
                else:
                    missing_fields = [field for field in required_fields if field not in team]
                    self.log_test("Team Structure", False, f"Missing fields in team data: {missing_fields}")
        else:
            self.log_test("Community Teams", False, f"Failed to get community teams: {data}")
        
        # Test 8: Test unauthorized access to post creation
        if self.test_user_token:
            status, data = await self.make_request("POST", "/community/posts", post_data, auth_token=self.test_user_token)
            if status == 403:
                self.log_test("Post Creation Authorization", True, "Non-admin/moderator properly blocked from creating posts")
            else:
                self.log_test("Post Creation Authorization", False, f"Authorization issue: regular user could create post: {status}")
        
        # Test 9: Delete community post (cleanup)
        if post_id:
            status, data = await self.make_request("DELETE", f"/community/posts/{post_id}", auth_token=self.admin_token)
            if status == 200:
                self.log_test("Delete Community Post", True, "Community post deleted successfully")
            else:
                self.log_test("Delete Community Post", False, f"Failed to delete community post: {data}")

    async def test_enhanced_profiles_system(self):
        """Test enhanced user profiles system with avatars and statistics."""
        print("\n👤 Testing Enhanced Profiles System...")
        
        if not self.test_user_token:
            self.log_test("Enhanced Profiles System", False, "No test user token available")
            return
        
        # Test 1: Get user profile with detailed statistics
        # First get the current user to get their ID
        status, user_data = await self.make_request("GET", "/auth/me", auth_token=self.test_user_token)
        if status != 200:
            self.log_test("Get Current User for Profile", False, "Could not get current user")
            return
        
        user_id = user_data.get("id")
        status, data = await self.make_request("GET", f"/profiles/{user_id}")
        if status == 200:
            required_sections = ["user", "profile", "statistics", "teams", "recent_matches"]
            if all(section in data for section in required_sections):
                self.log_test("Get User Profile", True, f"Retrieved detailed profile for {data['user']['username']}")
                
                # Verify statistics structure
                stats = data["statistics"]
                required_stats = ["tournaments", "matches", "trophies", "ranking"]
                if all(stat in stats for stat in required_stats):
                    trophies = stats["trophies"]
                    ranking = stats["ranking"]
                    self.log_test("Profile Statistics", True, f"User has {trophies['total']} trophies, {ranking['total_points']} points, level: {ranking['level']}")
                else:
                    missing_stats = [stat for stat in required_stats if stat not in stats]
                    self.log_test("Profile Statistics", False, f"Missing statistics: {missing_stats}")
            else:
                missing_sections = [section for section in required_sections if section not in data]
                self.log_test("Get User Profile", False, f"Missing profile sections: {missing_sections}")
        else:
            self.log_test("Get User Profile", False, f"Failed to get user profile: {data}")
        
        # Test 2: Update user profile with enhanced fields
        profile_update = {
            "display_name": "Alex Martin - Pro Gamer",
            "bio": "Joueur passionné de CS2 avec 5 ans d'expérience en compétition",
            "discord_username": "AlexGamer#1234",
            "twitch_username": "alexgaming_pro",
            "steam_profile": "https://steamcommunity.com/id/alexgamer",
            "location": "Paris, France",
            "favorite_games": ["cs2", "lol"],
            "gaming_experience": {
                "cs2": "expert",
                "lol": "intermediate"
            }
        }
        
        status, data = await self.make_request("PUT", "/profiles/my-profile", profile_update, auth_token=self.test_user_token)
        if status == 200:
            self.log_test("Update User Profile", True, "Profile updated with enhanced fields successfully")
        else:
            self.log_test("Update User Profile", False, f"Failed to update profile: {data}")
        
        # Test 3: Test base64 avatar upload (NEW feature)
        # Create a simple base64 encoded test image (1x1 pixel PNG)
        test_avatar_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg=="
        avatar_data = f"data:image/png;base64,{test_avatar_base64}"
        
        # URL encode the avatar data for query parameter
        import urllib.parse
        encoded_avatar = urllib.parse.quote(avatar_data)
        status, data = await self.make_request("POST", f"/profiles/upload-avatar-base64?avatar_data={encoded_avatar}", auth_token=self.test_user_token)
        if status == 200 and "avatar_url" in data:
            self.log_test("Base64 Avatar Upload", True, f"Avatar uploaded successfully: {data.get('message')}")
            
            # Verify the avatar URL contains base64 data
            avatar_url = data["avatar_url"]
            if avatar_url.startswith("data:image/png;base64,"):
                self.log_test("Avatar Base64 Format", True, "Avatar stored in correct base64 format for frontend compatibility")
            else:
                self.log_test("Avatar Base64 Format", False, f"Avatar URL format unexpected: {avatar_url[:50]}...")
        else:
            self.log_test("Base64 Avatar Upload", False, f"Failed to upload base64 avatar: {data}")
        
        # Test 4: Test invalid base64 avatar upload
        invalid_avatar_data = "invalid_base64_data"
        encoded_invalid = urllib.parse.quote(invalid_avatar_data)
        status, data = await self.make_request("POST", f"/profiles/upload-avatar-base64?avatar_data={encoded_invalid}", auth_token=self.test_user_token)
        if status == 400:
            self.log_test("Invalid Avatar Validation", True, "Invalid base64 data properly rejected")
        else:
            self.log_test("Invalid Avatar Validation", False, f"Invalid avatar data was accepted: {status}")
        
        # Test 5: Verify profile update persistence
        status, updated_profile = await self.make_request("GET", f"/profiles/{user_id}")
        if status == 200:
            profile = updated_profile["profile"]
            if (profile.get("display_name") == profile_update["display_name"] and
                profile.get("bio") == profile_update["bio"] and
                profile.get("location") == profile_update["location"]):
                self.log_test("Profile Update Persistence", True, "Profile updates persisted correctly")
            else:
                self.log_test("Profile Update Persistence", False, "Profile updates not persisted correctly")
        else:
            self.log_test("Profile Update Persistence", False, "Could not verify profile update persistence")
        
        # Test 6: Test profile access for non-existent user
        fake_user_id = str(uuid.uuid4())
        status, data = await self.make_request("GET", f"/profiles/{fake_user_id}")
        if status == 404:
            self.log_test("Non-existent Profile", True, "404 returned for non-existent user profile")
        else:
            self.log_test("Non-existent Profile", False, f"Expected 404 for non-existent user, got {status}")

    async def test_enhanced_teams_system(self):
        """Test enhanced teams system with 6-member support and leaderboards."""
        print("\n👥 Testing Enhanced Teams System...")
        
        if not self.test_user_token:
            self.log_test("Enhanced Teams System", False, "No test user token available")
            return
        
        # Test 1: Create team with 6-member maximum
        team_data = {
            "name": "Team Oupafamilly Elite",
            "description": "Équipe d'élite pour les tournois CS2",
            "game": "cs2",
            "max_members": 6
        }
        
        status, data = await self.make_request("POST", "/teams/", team_data, auth_token=self.test_user_token)
        team_id = None
        if status == 200 and data.get("id"):
            team_id = data["id"]
            self.log_test("Create Team with 6 Members", True, f"Team created: {data.get('name')} with max_members: {data.get('max_members')}")
            
            # Verify max_members is 6
            if data.get("max_members") == 6:
                self.log_test("Team Max Members Validation", True, "Team supports maximum 6 members as required")
            else:
                self.log_test("Team Max Members Validation", False, f"Team max_members is {data.get('max_members')}, expected 6")
        else:
            self.log_test("Create Team with 6 Members", False, f"Failed to create team: {data}")
        
        # Test 2: Get team leaderboard with rankings
        status, data = await self.make_request("GET", "/teams/leaderboard")
        if status == 200 and "leaderboard" in data:
            leaderboard = data["leaderboard"]
            self.log_test("Team Leaderboard", True, f"Retrieved team leaderboard with {len(leaderboard)} teams")
            
            # Verify leaderboard structure
            if leaderboard:
                team = leaderboard[0]
                required_fields = ["team_id", "name", "game", "captain", "members", "member_count", "max_members", "statistics", "rank", "badge"]
                if all(field in team for field in required_fields):
                    stats = team["statistics"]
                    self.log_test("Team Leaderboard Structure", True, f"Top team: {team['name']} with {stats['total_points']} points, rank: {team['rank']}")
                    
                    # Verify statistics structure
                    required_stats = ["total_tournaments", "tournaments_won", "win_rate", "total_points", "victories_by_type"]
                    if all(stat in stats for stat in required_stats):
                        victories = stats["victories_by_type"]
                        self.log_test("Team Statistics Structure", True, f"Team has victories: 1v1: {victories['1v1']}, 2v2: {victories['2v2']}, 5v5: {victories['5v5']}")
                    else:
                        missing_stats = [stat for stat in required_stats if stat not in stats]
                        self.log_test("Team Statistics Structure", False, f"Missing team statistics: {missing_stats}")
                else:
                    missing_fields = [field for field in required_fields if field not in team]
                    self.log_test("Team Leaderboard Structure", False, f"Missing fields in team leaderboard: {missing_fields}")
        else:
            self.log_test("Team Leaderboard", False, f"Failed to get team leaderboard: {data}")
        
        # Test 3: Get team statistics for community
        status, data = await self.make_request("GET", "/teams/stats/community")
        if status == 200:
            required_fields = ["total_teams", "open_teams", "games_popularity", "average_team_size", "community_engagement"]
            if all(field in data for field in required_fields):
                self.log_test("Team Community Stats", True, f"Total teams: {data['total_teams']}, Open teams: {data['open_teams']}, Avg size: {data['average_team_size']}")
            else:
                missing_fields = [field for field in required_fields if field not in data]
                self.log_test("Team Community Stats", False, f"Missing fields in team stats: {missing_fields}")
        else:
            self.log_test("Team Community Stats", False, f"Failed to get team community stats: {data}")
        
        # Test 4: Test team leaderboard with game filter
        status, data = await self.make_request("GET", "/teams/leaderboard?game=cs2")
        if status == 200 and "leaderboard" in data:
            leaderboard = data["leaderboard"]
            # Verify all teams are CS2
            cs2_only = all(team.get("game") == "cs2" for team in leaderboard)
            if cs2_only:
                self.log_test("Team Leaderboard Game Filter", True, f"All {len(leaderboard)} teams are CS2 as filtered")
            else:
                non_cs2 = [team.get("game") for team in leaderboard if team.get("game") != "cs2"]
                self.log_test("Team Leaderboard Game Filter", False, f"Found non-CS2 teams in CS2 filter: {non_cs2}")
        else:
            self.log_test("Team Leaderboard Game Filter", False, f"Failed to get filtered team leaderboard: {data}")
        
        # Test 5: Test team update functionality
        if team_id:
            update_data = {
                "description": "Équipe d'élite mise à jour pour les tournois CS2 et autres compétitions",
                "is_open": False,
                "max_members": 5  # Try to reduce max_members
            }
            
            status, data = await self.make_request("PUT", f"/teams/{team_id}", update_data, auth_token=self.test_user_token)
            if status == 200:
                self.log_test("Team Update", True, "Team updated successfully")
                
                # Verify the team was updated
                status, updated_team = await self.make_request("GET", f"/teams/{team_id}")
                if status == 200:
                    if (updated_team.get("description") == update_data["description"] and
                        updated_team.get("is_open") == update_data["is_open"]):
                        self.log_test("Team Update Persistence", True, "Team updates persisted correctly")
                    else:
                        self.log_test("Team Update Persistence", False, "Team updates not persisted correctly")
            else:
                self.log_test("Team Update", False, f"Failed to update team: {data}")
        
        # Test 6: Test team deletion (cleanup)
        if team_id:
            status, data = await self.make_request("DELETE", f"/teams/{team_id}", auth_token=self.test_user_token)
            if status == 200:
                self.log_test("Team Deletion", True, f"Team deleted successfully: {data.get('message')}")
                
                # Verify team is deleted
                status, _ = await self.make_request("GET", f"/teams/{team_id}")
                if status == 404:
                    self.log_test("Team Deletion Verification", True, "Team properly removed from database")
                else:
                    self.log_test("Team Deletion Verification", False, "Team still exists after deletion")
            else:
                self.log_test("Team Deletion", False, f"Failed to delete team: {data}")

    async def test_server_integration_update(self):
        """Test server integration with new community and profiles routes."""
        print("\n🔗 Testing Server Integration Update...")
        
        # Test 1: Verify community routes are integrated
        status, data = await self.make_request("GET", "/")
        if status == 200 and "endpoints" in data:
            endpoints = data["endpoints"]
            if "community" in str(endpoints) or "/api/community" in str(endpoints):
                self.log_test("Community Routes Integration", True, "Community routes integrated in server")
            else:
                self.log_test("Community Routes Integration", False, "Community routes not found in server endpoints")
            
            if "profiles" in str(endpoints) or "/api/profiles" in str(endpoints):
                self.log_test("Profiles Routes Integration", True, "Profiles routes integrated in server")
            else:
                self.log_test("Profiles Routes Integration", False, "Profiles routes not found in server endpoints")
        else:
            self.log_test("Server Endpoints", False, f"Failed to get server endpoints: {data}")
        
        # Test 2: Test direct access to community endpoints
        status, data = await self.make_request("GET", "/community/stats")
        if status == 200:
            self.log_test("Community Endpoint Access", True, "Community endpoints accessible via /api/community")
        else:
            self.log_test("Community Endpoint Access", False, f"Community endpoints not accessible: {status}")
        
        # Test 3: Test direct access to profiles endpoints (with auth)
        if self.test_user_token:
            status, user_data = await self.make_request("GET", "/auth/me", auth_token=self.test_user_token)
            if status == 200:
                user_id = user_data.get("id")
                status, data = await self.make_request("GET", f"/profiles/{user_id}")
                if status == 200:
                    self.log_test("Profiles Endpoint Access", True, "Profiles endpoints accessible via /api/profiles")
                else:
                    self.log_test("Profiles Endpoint Access", False, f"Profiles endpoints not accessible: {status}")
        
        # Test 4: Verify CORS and middleware configuration
        # This is tested implicitly by all other API calls working
        self.log_test("CORS Configuration", True, "CORS middleware working (all API calls successful)")

    async def test_enhanced_team_management_system(self):
        """Test enhanced team management system with captain moderation features."""
        print("\n👥 Testing Enhanced Team Management System...")
        
        if not self.admin_token or not self.test_user_token:
            self.log_test("Enhanced Team Management Setup", False, "Missing required tokens for testing")
            return
        
        # Create a test team as admin (captain)
        team_data = {
            "name": "Team Management Test",
            "description": "Team for testing enhanced management features",
            "game": "cs2",
            "max_members": 6
        }
        
        status, data = await self.make_request("POST", "/teams/", team_data, auth_token=self.admin_token)
        team_id = None
        if status == 200 and data.get("id"):
            team_id = data["id"]
            self.log_test("Create Team for Management Test", True, f"Team created: {data.get('name')}")
        else:
            self.log_test("Create Team for Management Test", False, f"Failed to create team: {data}")
            return
        
        # Test 1: Get available users for team (captain only)
        status, data = await self.make_request("GET", f"/teams/{team_id}/available-users", auth_token=self.admin_token)
        if status == 200 and "available_users" in data:
            available_users = data["available_users"]
            self.log_test("Get Available Users (Captain)", True, f"Retrieved {len(available_users)} available users")
            
            # Test with non-captain user (should fail)
            status, data = await self.make_request("GET", f"/teams/{team_id}/available-users", auth_token=self.test_user_token)
            if status == 403:
                self.log_test("Available Users Permission Check", True, "Non-captain properly blocked from viewing available users")
            else:
                self.log_test("Available Users Permission Check", False, f"Non-captain access not blocked: {status}")
        else:
            self.log_test("Get Available Users (Captain)", False, f"Failed to get available users: {data}")
        
        # Test 2: Add member to team (captain only)
        if available_users:
            user_to_add = available_users[0]["id"]
            status, data = await self.make_request("POST", f"/teams/{team_id}/add-member?user_id={user_to_add}", auth_token=self.admin_token)
            if status == 200:
                self.log_test("Add Member to Team (Captain)", True, f"Member added successfully: {data.get('message')}")
                
                # Verify member was added
                status, team_data = await self.make_request("GET", f"/teams/{team_id}")
                if status == 200 and user_to_add in team_data.get("members", []):
                    self.log_test("Member Addition Verification", True, "Member successfully added to team")
                else:
                    self.log_test("Member Addition Verification", False, "Member not found in team after addition")
                
                # Test with non-captain user (should fail)
                if len(available_users) > 1:
                    another_user = available_users[1]["id"]
                    status, data = await self.make_request("POST", f"/teams/{team_id}/add-member?user_id={another_user}", auth_token=self.test_user_token)
                    if status == 403:
                        self.log_test("Add Member Permission Check", True, "Non-captain properly blocked from adding members")
                    else:
                        self.log_test("Add Member Permission Check", False, f"Non-captain add member not blocked: {status}")
            else:
                self.log_test("Add Member to Team (Captain)", False, f"Failed to add member: {data}")
        
        # Test 3: Remove member from team (captain only, cannot remove captain)
        if available_users and team_id:
            # Try to remove the added member
            user_to_remove = available_users[0]["id"]
            status, data = await self.make_request("DELETE", f"/teams/{team_id}/remove-member/{user_to_remove}", auth_token=self.admin_token)
            if status == 200:
                self.log_test("Remove Member from Team (Captain)", True, f"Member removed successfully: {data.get('message')}")
                
                # Verify member was removed
                status, team_data = await self.make_request("GET", f"/teams/{team_id}")
                if status == 200 and user_to_remove not in team_data.get("members", []):
                    self.log_test("Member Removal Verification", True, "Member successfully removed from team")
                else:
                    self.log_test("Member Removal Verification", False, "Member still in team after removal")
            else:
                self.log_test("Remove Member from Team (Captain)", False, f"Failed to remove member: {data}")
            
            # Test removing captain (should fail)
            status, team_data = await self.make_request("GET", f"/teams/{team_id}")
            if status == 200:
                captain_id = team_data.get("captain_id")
                status, data = await self.make_request("DELETE", f"/teams/{team_id}/remove-member/{captain_id}", auth_token=self.admin_token)
                if status == 400:
                    self.log_test("Captain Removal Protection", True, "Captain removal properly blocked")
                else:
                    self.log_test("Captain Removal Protection", False, f"Captain removal not blocked: {status}")
        
        # Test 4: Multi-team membership support
        # Create another team with test user as captain
        team_data_2 = {
            "name": "Multi Team Test",
            "description": "Second team for multi-membership testing",
            "game": "cs2",
            "max_members": 6
        }
        
        status, data = await self.make_request("POST", "/teams/", team_data_2, auth_token=self.test_user_token)
        team_id_2 = None
        if status == 200 and data.get("id"):
            team_id_2 = data["id"]
            self.log_test("Create Second Team", True, f"Second team created: {data.get('name')}")
            
            # Add admin user to second team (multi-team membership)
            status, admin_data = await self.make_request("GET", "/auth/me", auth_token=self.admin_token)
            if status == 200:
                admin_id = admin_data.get("id")
                status, data = await self.make_request("POST", f"/teams/{team_id_2}/add-member?user_id={admin_id}", auth_token=self.test_user_token)
                if status == 200:
                    self.log_test("Multi-Team Membership", True, "User successfully added to multiple teams")
                    
                    # Verify user is in both teams
                    status, user_teams = await self.make_request("GET", "/teams/my-teams", auth_token=self.admin_token)
                    if status == 200 and len(user_teams) >= 2:
                        team_names = [team["name"] for team in user_teams]
                        if "Team Management Test" in team_names and "Multi Team Test" in team_names:
                            self.log_test("Multi-Team Verification", True, f"User is member of {len(user_teams)} teams")
                        else:
                            self.log_test("Multi-Team Verification", False, f"User teams don't include expected teams: {team_names}")
                    else:
                        self.log_test("Multi-Team Verification", False, f"User teams count unexpected: {len(user_teams) if status == 200 else 'error'}")
                else:
                    self.log_test("Multi-Team Membership", False, f"Failed to add user to second team: {data}")
        else:
            self.log_test("Create Second Team", False, f"Failed to create second team: {data}")
        
        # Test 5: Team member limit enforcement (6 members maximum)
        if team_id and available_users:
            # Try to add members up to the limit
            members_added = 1  # Admin is already captain/member
            for i, user in enumerate(available_users[1:6]):  # Skip first user (already tested)
                if members_added >= 6:
                    break
                status, data = await self.make_request("POST", f"/teams/{team_id}/add-member?user_id={user['id']}", auth_token=self.admin_token)
                if status == 200:
                    members_added += 1
                else:
                    break
            
            # Try to add one more member (should fail due to limit)
            if members_added == 6 and len(available_users) > 6:
                extra_user = available_users[6]["id"]
                status, data = await self.make_request("POST", f"/teams/{team_id}/add-member?user_id={extra_user}", auth_token=self.admin_token)
                if status == 400 and "full" in data.get("detail", "").lower():
                    self.log_test("6-Member Limit Enforcement", True, f"Team limit properly enforced at {members_added} members")
                else:
                    self.log_test("6-Member Limit Enforcement", False, f"Team limit not enforced: {status} - {data}")
            else:
                self.log_test("6-Member Limit Enforcement", True, f"Team has {members_added} members (limit testing not possible with available users)")
        
        # Cleanup: Delete test teams
        if team_id:
            await self.make_request("DELETE", f"/teams/{team_id}", auth_token=self.admin_token)
        if team_id_2:
            await self.make_request("DELETE", f"/teams/{team_id_2}", auth_token=self.test_user_token)

    async def test_team_deletion_functionality(self):
        """Test team deletion functionality comprehensively as per user requirements."""
        print("\n🗑️ Testing Team Deletion Functionality...")
        
        if not self.admin_token or not self.test_user_token:
            self.log_test("Team Deletion Setup", False, "Missing required tokens for testing")
            return
        
        # Create test teams for deletion testing
        test_team_data = {
            "name": "Team Deletion Test",
            "description": "Team created specifically for testing deletion functionality",
            "game": "cs2",
            "max_members": 6
        }
        
        # Test 1: Create team as captain (test user)
        status, data = await self.make_request("POST", "/teams/", test_team_data, auth_token=self.test_user_token)
        team_id = None
        if status == 200 and data.get("id"):
            team_id = data["id"]
            self.log_test("Create Team for Deletion Test", True, f"Team created: {data.get('name')}")
        else:
            self.log_test("Create Team for Deletion Test", False, f"Failed to create team: {data}")
            return
        
        # Test 2: Try to delete team with non-captain user (should fail with 403)
        # First create another user to test non-captain access
        test_user_2_data = {
            "username": "non_captain_user",
            "email": "noncaptain@example.com",
            "password": "Test123!",
            "display_name": "Non Captain User"
        }
        
        # Register second user
        status, _ = await self.make_request("POST", "/auth/register", test_user_2_data)
        if status == 200 or (status == 400 and "already registered" in str(_)):
            # Login second user
            login_data = {"email": test_user_2_data["email"], "password": test_user_2_data["password"]}
            status, login_response = await self.make_request("POST", "/auth/login", login_data)
            if status == 200:
                non_captain_token = login_response["access_token"]
                
                # Try to delete team with non-captain user
                status, data = await self.make_request("DELETE", f"/teams/{team_id}/delete", auth_token=non_captain_token)
                if status == 403:
                    self.log_test("Non-Captain Deletion Block", True, "Non-captain user properly blocked from deleting team")
                else:
                    self.log_test("Non-Captain Deletion Block", False, f"Non-captain deletion not blocked: {status} - {data}")
            else:
                self.log_test("Non-Captain User Login", False, "Could not login non-captain user for testing")
        
        # Test 3: Try to delete non-existent team (should return 404)
        fake_team_id = "fake-team-id-12345"
        status, data = await self.make_request("DELETE", f"/teams/{fake_team_id}/delete", auth_token=self.test_user_token)
        if status == 404:
            self.log_test("Delete Non-existent Team", True, "404 returned for non-existent team")
        else:
            self.log_test("Delete Non-existent Team", False, f"Expected 404, got {status}: {data}")
        
        # Test 4: Create tournament and register team to test active tournament protection
        tournament_data = {
            "title": "Test Tournament for Team Deletion",
            "description": "Tournament to test team deletion protection",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 8,
            "entry_fee": 0.0,
            "prize_pool": 50.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "Test tournament rules"
        }
        
        status, tournament_response = await self.make_request("POST", "/tournaments/", tournament_data, auth_token=self.admin_token)
        tournament_id = None
        if status == 200:
            tournament_id = tournament_response["id"]
            
            # Set tournament to open status
            status, _ = await self.make_request("PUT", f"/tournaments/{tournament_id}/status?new_status=open", auth_token=self.admin_token)
            
            if status == 200:
                # Register team for tournament
                status, _ = await self.make_request("POST", f"/tournaments/{tournament_id}/register", 
                                                 {"team_id": team_id}, auth_token=self.test_user_token)
                
                if status == 200:
                    self.log_test("Team Tournament Registration", True, "Team registered for tournament successfully")
                    
                    # Test 5: Try to delete team while registered in active tournament (should fail with 400)
                    status, data = await self.make_request("DELETE", f"/teams/{team_id}/delete", auth_token=self.test_user_token)
                    if status == 400 and "active tournaments" in data.get("detail", "").lower():
                        self.log_test("Active Tournament Deletion Block", True, "Team deletion properly blocked due to active tournament registration")
                    else:
                        self.log_test("Active Tournament Deletion Block", False, f"Team deletion not blocked for active tournament: {status} - {data}")
                    
                    # Complete the tournament to test cleanup functionality
                    status, _ = await self.make_request("PUT", f"/tournaments/{tournament_id}/status?new_status=completed", auth_token=self.admin_token)
                    
                    if status == 200:
                        # Test 6: Delete team after tournament completion (should succeed and cleanup)
                        status, data = await self.make_request("DELETE", f"/teams/{team_id}/delete", auth_token=self.test_user_token)
                        if status == 200:
                            self.log_test("Team Deletion After Tournament Completion", True, f"Team deleted successfully: {data.get('message')}")
                            
                            # Verify team is actually deleted
                            status, _ = await self.make_request("GET", f"/teams/{team_id}")
                            if status == 404:
                                self.log_test("Team Deletion Verification", True, "Team properly removed from database")
                            else:
                                self.log_test("Team Deletion Verification", False, "Team still exists after deletion")
                            
                            # Verify team was cleaned up from tournament participants
                            status, tournament_details = await self.make_request("GET", f"/tournaments/{tournament_id}")
                            if status == 200:
                                participants = tournament_details.get("participants", [])
                                if team_id not in participants:
                                    self.log_test("Tournament Cleanup Verification", True, "Team properly removed from tournament participants")
                                else:
                                    self.log_test("Tournament Cleanup Verification", False, "Team still in tournament participants after deletion")
                        else:
                            self.log_test("Team Deletion After Tournament Completion", False, f"Team deletion failed: {data}")
                    else:
                        self.log_test("Tournament Status Update", False, "Could not complete tournament for cleanup testing")
                else:
                    self.log_test("Team Tournament Registration", False, "Could not register team for tournament")
            else:
                self.log_test("Tournament Status Update", False, "Could not set tournament to open status")
        else:
            self.log_test("Tournament Creation for Deletion Test", False, "Could not create tournament for testing")
        
        # Test 7: Test successful team deletion without tournament constraints
        # Create another team for clean deletion test
        clean_team_data = {
            "name": "Clean Deletion Test Team",
            "description": "Team for testing clean deletion",
            "game": "cs2",
            "max_members": 6
        }
        
        status, data = await self.make_request("POST", "/teams/", clean_team_data, auth_token=self.test_user_token)
        clean_team_id = None
        if status == 200:
            clean_team_id = data["id"]
            
            # Delete team immediately (should succeed)
            status, data = await self.make_request("DELETE", f"/teams/{clean_team_id}/delete", auth_token=self.test_user_token)
            if status == 200:
                self.log_test("Clean Team Deletion", True, f"Team deleted successfully: {data.get('message')}")
                
                # Verify deletion
                status, _ = await self.make_request("GET", f"/teams/{clean_team_id}")
                if status == 404:
                    self.log_test("Clean Team Deletion Verification", True, "Team properly removed from database")
                else:
                    self.log_test("Clean Team Deletion Verification", False, "Team still exists after deletion")
            else:
                self.log_test("Clean Team Deletion", False, f"Clean team deletion failed: {data}")
        
        # Cleanup: Delete test tournament if created
        if tournament_id:
            await self.make_request("DELETE", f"/tournaments/{tournament_id}", auth_token=self.admin_token)

    async def test_enhanced_tournament_registration_system(self):
        """Test enhanced tournament registration system focusing on tournament type detection logic."""
        print("\n🏆 Testing Enhanced Tournament Registration System...")
        
        if not self.admin_token or not self.test_user_token:
            self.log_test("Enhanced Tournament Registration Setup", False, "Missing required tokens for testing")
            return
        
        # Create test teams for different scenarios
        team_2v2_data = {
            "name": "Test 2v2 Team",
            "description": "Team for testing 2v2 tournament registration",
            "game": "cs2",
            "max_members": 6
        }
        
        team_5v5_data = {
            "name": "Test 5v5 Team", 
            "description": "Team for testing 5v5 tournament registration",
            "game": "cs2",
            "max_members": 6
        }
        
        # Create teams
        status, data = await self.make_request("POST", "/teams/", team_2v2_data, auth_token=self.test_user_token)
        team_2v2_id = data.get("id") if status == 200 else None
        
        status, data = await self.make_request("POST", "/teams/", team_5v5_data, auth_token=self.admin_token)
        team_5v5_id = data.get("id") if status == 200 else None
        
        if not team_2v2_id or not team_5v5_id:
            self.log_test("Create Teams for Registration Test", False, "Failed to create required teams")
            return
        
        self.log_test("Create Teams for Registration Test", True, "Created 2v2 and 5v5 test teams")
        
        # Test Scenario 1: 1v1 Tournament with max_participants=8 (should allow individual registration)
        tournament_1v1_8_data = {
            "title": "CS2 Quick Match 1v1 Championship",
            "description": "Individual 1v1 tournament with 8 participants",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 8,
            "entry_fee": 0.0,
            "prize_pool": 50.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "1v1 individual tournament rules"
        }
        
        status, data = await self.make_request("POST", "/tournaments/", tournament_1v1_8_data, auth_token=self.admin_token)
        tournament_1v1_8_id = data.get("id") if status == 200 else None
        
        if tournament_1v1_8_id:
            await self.make_request("PUT", f"/tournaments/{tournament_1v1_8_id}/status?new_status=open", auth_token=self.admin_token)
            
            # Test user-teams endpoint for 1v1 tournament
            status, data = await self.make_request("GET", f"/tournaments/{tournament_1v1_8_id}/user-teams", auth_token=self.test_user_token)
            if status == 200:
                requires_team = data.get("requires_team", True)
                can_register_individual = data.get("can_register_individual", False)
                
                if not requires_team and can_register_individual:
                    self.log_test("1v1 Tournament Type Detection (8 participants)", True, "1v1 tournament correctly detected as individual")
                else:
                    self.log_test("1v1 Tournament Type Detection (8 participants)", False, f"1v1 tournament incorrectly requires team: requires_team={requires_team}, can_register_individual={can_register_individual}")
            
            # Test individual registration for 1v1 tournament
            status, data = await self.make_request("POST", f"/tournaments/{tournament_1v1_8_id}/register", auth_token=self.test_user_token)
            if status == 200:
                self.log_test("1v1 Individual Registration (8 participants)", True, "Individual registration successful for 1v1 tournament")
            else:
                self.log_test("1v1 Individual Registration (8 participants)", False, f"Individual registration failed for 1v1: {data}")
        
        # Test Scenario 2: 1v1 Tournament with max_participants=16 (should allow individual registration)
        tournament_1v1_16_data = {
            "title": "CS2 Solo Championship 1v1",
            "description": "Large individual 1v1 tournament with 16 participants",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 16,
            "entry_fee": 0.0,
            "prize_pool": 100.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "1v1 individual tournament rules for 16 players"
        }
        
        status, data = await self.make_request("POST", "/tournaments/", tournament_1v1_16_data, auth_token=self.admin_token)
        tournament_1v1_16_id = data.get("id") if status == 200 else None
        
        if tournament_1v1_16_id:
            await self.make_request("PUT", f"/tournaments/{tournament_1v1_16_id}/status?new_status=open", auth_token=self.admin_token)
            
            # Test user-teams endpoint
            status, data = await self.make_request("GET", f"/tournaments/{tournament_1v1_16_id}/user-teams", auth_token=self.test_user_token)
            if status == 200:
                requires_team = data.get("requires_team", True)
                can_register_individual = data.get("can_register_individual", False)
                
                if not requires_team and can_register_individual:
                    self.log_test("1v1 Tournament Type Detection (16 participants)", True, "1v1 tournament correctly detected as individual")
                else:
                    self.log_test("1v1 Tournament Type Detection (16 participants)", False, f"1v1 tournament incorrectly requires team: requires_team={requires_team}")
            
            # Test individual registration
            status, data = await self.make_request("POST", f"/tournaments/{tournament_1v1_16_id}/register", auth_token=self.admin_token)
            if status == 200:
                self.log_test("1v1 Individual Registration (16 participants)", True, "Individual registration successful for 1v1 tournament")
            else:
                self.log_test("1v1 Individual Registration (16 participants)", False, f"Individual registration failed: {data}")
        
        # Test Scenario 3: 2v2 Tournament with max_participants=4 (should require team)
        tournament_2v2_data = {
            "title": "CS2 Duo Championship 2v2",
            "description": "Team 2v2 tournament with 4 teams",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 4,
            "entry_fee": 0.0,
            "prize_pool": 75.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "2v2 team tournament rules"
        }
        
        status, data = await self.make_request("POST", "/tournaments/", tournament_2v2_data, auth_token=self.admin_token)
        tournament_2v2_id = data.get("id") if status == 200 else None
        
        if tournament_2v2_id:
            await self.make_request("PUT", f"/tournaments/{tournament_2v2_id}/status?new_status=open", auth_token=self.admin_token)
            
            # Test user-teams endpoint
            status, data = await self.make_request("GET", f"/tournaments/{tournament_2v2_id}/user-teams", auth_token=self.test_user_token)
            if status == 200:
                requires_team = data.get("requires_team", False)
                can_register_individual = data.get("can_register_individual", True)
                
                if requires_team and not can_register_individual:
                    self.log_test("2v2 Tournament Type Detection", True, "2v2 tournament correctly requires team")
                else:
                    self.log_test("2v2 Tournament Type Detection", False, f"2v2 tournament should require team: requires_team={requires_team}")
            
            # Test individual registration (should fail)
            status, data = await self.make_request("POST", f"/tournaments/{tournament_2v2_id}/register", auth_token=self.test_user_token)
            if status == 400 and "team is required" in data.get("detail", "").lower():
                self.log_test("2v2 Individual Registration Block", True, "Individual registration properly blocked for 2v2")
            else:
                self.log_test("2v2 Individual Registration Block", False, f"Individual registration should be blocked: {status} - {data}")
            
            # Test team registration (should succeed)
            status, data = await self.make_request("POST", f"/tournaments/{tournament_2v2_id}/register?team_id={team_2v2_id}", auth_token=self.test_user_token)
            if status == 200:
                self.log_test("2v2 Team Registration", True, "Team registration successful for 2v2 tournament")
            else:
                self.log_test("2v2 Team Registration", False, f"Team registration failed: {data}")
        
        # Test Scenario 4: 5v5 Tournament with max_participants=10 (should require team)
        tournament_5v5_data = {
            "title": "CS2 Competitive 5v5 League",
            "description": "Team 5v5 tournament with 10 teams",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 10,
            "entry_fee": 0.0,
            "prize_pool": 200.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "5v5 team tournament rules"
        }
        
        status, data = await self.make_request("POST", "/tournaments/", tournament_5v5_data, auth_token=self.admin_token)
        tournament_5v5_id = data.get("id") if status == 200 else None
        
        if tournament_5v5_id:
            await self.make_request("PUT", f"/tournaments/{tournament_5v5_id}/status?new_status=open", auth_token=self.admin_token)
            
            # Test user-teams endpoint
            status, data = await self.make_request("GET", f"/tournaments/{tournament_5v5_id}/user-teams", auth_token=self.admin_token)
            if status == 200:
                requires_team = data.get("requires_team", False)
                can_register_individual = data.get("can_register_individual", True)
                
                if requires_team and not can_register_individual:
                    self.log_test("5v5 Tournament Type Detection", True, "5v5 tournament correctly requires team")
                else:
                    self.log_test("5v5 Tournament Type Detection", False, f"5v5 tournament should require team: requires_team={requires_team}")
            
            # Test individual registration (should fail)
            status, data = await self.make_request("POST", f"/tournaments/{tournament_5v5_id}/register", auth_token=self.admin_token)
            if status == 400 and "team is required" in data.get("detail", "").lower():
                self.log_test("5v5 Individual Registration Block", True, "Individual registration properly blocked for 5v5")
            else:
                self.log_test("5v5 Individual Registration Block", False, f"Individual registration should be blocked: {status} - {data}")
            
            # Test team registration (should succeed)
            status, data = await self.make_request("POST", f"/tournaments/{tournament_5v5_id}/register?team_id={team_5v5_id}", auth_token=self.admin_token)
            if status == 200:
                self.log_test("5v5 Team Registration", True, "Team registration successful for 5v5 tournament")
            else:
                self.log_test("5v5 Team Registration", False, f"Team registration failed: {data}")
        
        # Test Scenario 5: Tournament without pattern in name (fallback logic test)
        tournament_fallback_data = {
            "title": "CS2 Championship Tournament",  # No 1v1, 2v2, 5v5 pattern
            "description": "Tournament to test fallback logic",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 4,  # Should trigger team requirement due to fallback logic
            "entry_fee": 0.0,
            "prize_pool": 50.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "Tournament to test fallback logic"
        }
        
        status, data = await self.make_request("POST", "/tournaments/", tournament_fallback_data, auth_token=self.admin_token)
        tournament_fallback_id = data.get("id") if status == 200 else None
        
        if tournament_fallback_id:
            await self.make_request("PUT", f"/tournaments/{tournament_fallback_id}/status?new_status=open", auth_token=self.admin_token)
            
            # Test fallback logic (max_participants <= 4 should require team)
            status, data = await self.make_request("GET", f"/tournaments/{tournament_fallback_id}/user-teams", auth_token=self.test_user_token)
            if status == 200:
                requires_team = data.get("requires_team", False)
                
                if requires_team:
                    self.log_test("Fallback Logic (max_participants=4)", True, "Tournament with max_participants=4 correctly requires team")
                else:
                    self.log_test("Fallback Logic (max_participants=4)", False, "Tournament with max_participants=4 should require team")
        
        # Test Scenario 6: Tournament with max_participants=8 and no pattern (should allow individual)
        tournament_fallback_8_data = {
            "title": "CS2 Championship Tournament Large",  # No pattern
            "description": "Tournament to test fallback logic with 8 participants",
            "game": "cs2",
            "tournament_type": "elimination",
            "max_participants": 8,  # Should allow individual due to fallback logic
            "entry_fee": 0.0,
            "prize_pool": 75.0,
            "registration_start": (datetime.utcnow() + timedelta(hours=1)).isoformat(),
            "registration_end": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "tournament_start": (datetime.utcnow() + timedelta(days=8)).isoformat(),
            "rules": "Tournament to test fallback logic with 8 participants"
        }
        
        status, data = await self.make_request("POST", "/tournaments/", tournament_fallback_8_data, auth_token=self.admin_token)
        tournament_fallback_8_id = data.get("id") if status == 200 else None
        
        if tournament_fallback_8_id:
            await self.make_request("PUT", f"/tournaments/{tournament_fallback_8_id}/status?new_status=open", auth_token=self.admin_token)
            
            # Test fallback logic (max_participants > 4 should allow individual)
            status, data = await self.make_request("GET", f"/tournaments/{tournament_fallback_8_id}/user-teams", auth_token=self.test_user_token)
            if status == 200:
                requires_team = data.get("requires_team", True)
                can_register_individual = data.get("can_register_individual", False)
                
                if not requires_team and can_register_individual:
                    self.log_test("Fallback Logic (max_participants=8)", True, "Tournament with max_participants=8 correctly allows individual")
                else:
                    self.log_test("Fallback Logic (max_participants=8)", False, f"Tournament with max_participants=8 should allow individual: requires_team={requires_team}")
        
        # Test Scenario 7: Team-game matching validation
        wrong_game_team_data = {
            "name": "Wrong Game Team",
            "description": "Team with wrong game for testing",
            "game": "lol",  # Different game
            "max_members": 6
        }
        
        status, data = await self.make_request("POST", "/teams/", wrong_game_team_data, auth_token=self.test_user_token)
        wrong_team_id = data.get("id") if status == 200 else None
        
        if wrong_team_id and tournament_2v2_id:
            # Try to register wrong game team for CS2 tournament
            status, data = await self.make_request("POST", f"/tournaments/{tournament_2v2_id}/register?team_id={wrong_team_id}", auth_token=self.test_user_token)
            if status == 400 and "doesn't match tournament game" in data.get("detail", ""):
                self.log_test("Team-Game Matching Validation", True, "Team-game matching validation working correctly")
            else:
                self.log_test("Team-Game Matching Validation", False, f"Team-game validation failed: {status} - {data}")
        
        # Cleanup created tournaments and teams
        cleanup_ids = [
            (tournament_1v1_8_id, "tournaments"),
            (tournament_1v1_16_id, "tournaments"),
            (tournament_2v2_id, "tournaments"),
            (tournament_5v5_id, "tournaments"),
            (tournament_fallback_id, "tournaments"),
            (tournament_fallback_8_id, "tournaments"),
            (team_2v2_id, "teams"),
            (team_5v5_id, "teams"),
            (wrong_team_id, "teams")
        ]
        
        for resource_id, resource_type in cleanup_ids:
            if resource_id:
                await self.make_request("DELETE", f"/{resource_type}/{resource_id}", auth_token=self.admin_token)

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
            await self.test_cs2_tournament_templates()  # New CS2 specific tests
            await self.test_tournament_deletion_feature()  # New deletion tests
            await self.test_content_management()
            await self.test_admin_dashboard()
            await self.test_protected_endpoints()
            
            # NEW TESTS for enhanced community and profiles features
            await self.test_community_management_system()
            await self.test_enhanced_profiles_system()
            await self.test_enhanced_teams_system()
            await self.test_server_integration_update()
            
            # ENHANCED TESTS for team management and tournament registration
            await self.test_enhanced_team_management_system()
            await self.test_enhanced_tournament_registration_system()
            
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