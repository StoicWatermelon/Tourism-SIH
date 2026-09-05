"""
Automated Integration & Unit Tests for Bharat Explore User Authentication,
Database Storage, Profile Management, and Bookmark Migration.
"""
import sys
import unittest
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from backend.server import app, SessionLocal, User, SavedJourney, UserTrip

client = TestClient(app)

class TestAuthAndUserData(unittest.TestCase):
    def setUp(self):
        self.db = SessionLocal()
        # Clean up any test users from prior runs
        test_emails = ["explorer.arya@example.com", "hiker.test@example.com", "migration.test@example.com"]
        for email in test_emails:
            users = self.db.query(User).filter(User.email == email).all()
            for u in users:
                self.db.query(SavedJourney).filter(SavedJourney.user_id == u.id).delete()
                self.db.query(UserTrip).filter(UserTrip.user_id == u.id).delete()
                self.db.delete(u)
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_01_register_user_success(self):
        payload = {
            "email": "explorer.arya@example.com",
            "password": "SecurePassword123!",
            "full_name": "Arya Stark",
            "phone": "+91 98765 43210",
            "travel_style": "High-Altitude Trekker",
            "home_city": "Dehradun",
            "emergency_contact": "+91 91234 56789 (Guardian)",
            "medical_notes": "Mild asthma, carries inhaler and Diamox"
        }
        res = client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 200, f"Register failed: {res.text}")
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("token", data)
        self.assertEqual(data["user"]["email"], "explorer.arya@example.com")
        self.assertEqual(data["user"]["fullName"], "Arya Stark")
        self.assertEqual(data["user"]["travelStyle"], "High-Altitude Trekker")
        self.assertEqual(data["user"]["homeCity"], "Dehradun")
        self.assertEqual(data["user"]["emergencyContact"], "+91 91234 56789 (Guardian)")
        self.assertEqual(data["user"]["medicalNotes"], "Mild asthma, carries inhaler and Diamox")

    def test_02_register_duplicate_email_fails(self):
        payload = {
            "email": "explorer.arya@example.com",
            "password": "AnotherPassword!",
            "full_name": "Duplicate User"
        }
        # First registration
        client.post("/api/auth/register", json=payload)
        # Duplicate registration
        res = client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("already exists", res.json()["detail"])

    def test_03_register_validation_checks(self):
        # Short password
        res = client.post("/api/auth/register", json={
            "email": "short@example.com",
            "password": "123",
            "full_name": "Short Pwd"
        })
        self.assertEqual(res.status_code, 400)

        # Invalid email
        res = client.post("/api/auth/register", json={
            "email": "notanemail",
            "password": "validpassword123",
            "full_name": "No Email"
        })
        self.assertEqual(res.status_code, 400)

    def test_04_login_flow(self):
        # Register
        reg_res = client.post("/api/auth/register", json={
            "email": "hiker.test@example.com",
            "password": "HikerSecret2026",
            "full_name": "Tenzing Norgay"
        })
        self.assertEqual(reg_res.status_code, 200)

        # Login with invalid password
        bad_login = client.post("/api/auth/login", json={
            "email": "hiker.test@example.com",
            "password": "WrongPassword"
        })
        self.assertEqual(bad_login.status_code, 401)

        # Login with correct password
        good_login = client.post("/api/auth/login", json={
            "email": "hiker.test@example.com",
            "password": "HikerSecret2026"
        })
        self.assertEqual(good_login.status_code, 200)
        token = good_login.json()["token"]
        self.assertTrue(len(token) > 20)

    def test_05_profile_me_and_update(self):
        # Register user
        reg_res = client.post("/api/auth/register", json={
            "email": "explorer.arya@example.com",
            "password": "SecurePassword123!",
            "full_name": "Arya Stark"
        })
        token = reg_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Check /api/auth/me
        me_res = client.get("/api/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["user"]["fullName"], "Arya Stark")

        # Update profile
        update_res = client.put("/api/auth/profile", headers=headers, json={
            "full_name": "Arya S.",
            "travel_style": "Cultural Heritage",
            "home_city": "Leh, Ladakh",
            "emergency_contact": "+91 99999 88888 (Base Camp)"
        })
        self.assertEqual(update_res.status_code, 200)
        updated_user = update_res.json()["user"]
        self.assertEqual(updated_user["fullName"], "Arya S.")
        self.assertEqual(updated_user["travelStyle"], "Cultural Heritage")
        self.assertEqual(updated_user["homeCity"], "Leh, Ladakh")
        self.assertEqual(updated_user["emergencyContact"], "+91 99999 88888 (Base Camp)")

    def test_06_change_password(self):
        # Register user
        reg_res = client.post("/api/auth/register", json={
            "email": "explorer.arya@example.com",
            "password": "OldPassword123!",
            "full_name": "Arya Stark"
        })
        token = reg_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Bad current password
        bad_pw = client.post("/api/auth/change-password", headers=headers, json={
            "current_password": "WrongPassword",
            "new_password": "NewBrandNewPassword123"
        })
        self.assertEqual(bad_pw.status_code, 400)

        # Correct current password
        good_pw = client.post("/api/auth/change-password", headers=headers, json={
            "current_password": "OldPassword123!",
            "new_password": "NewBrandNewPassword123"
        })
        self.assertEqual(good_pw.status_code, 200)

        # Verify login works with new password
        login_new = client.post("/api/auth/login", json={
            "email": "explorer.arya@example.com",
            "password": "NewBrandNewPassword123"
        })
        self.assertEqual(login_new.status_code, 200)

    def test_07_user_saved_bookmarks(self):
        # Register user
        reg_res = client.post("/api/auth/register", json={
            "email": "explorer.arya@example.com",
            "password": "SecurePassword123!",
            "full_name": "Arya Stark"
        })
        token = reg_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Save bookmarks
        save_res = client.post("/api/user/save", headers=headers, json={
            "destination_ids": ["pangong", "nubra", "khardungla"],
            "notes": "Himalayan circuit planned for June 2026",
            "travel_style": "High-Altitude"
        })
        self.assertEqual(save_res.status_code, 200)
        self.assertEqual(save_res.json()["saved_count"], 3)

        # Retrieve saved destinations
        get_res = client.get("/api/user/saved", headers=headers)
        self.assertEqual(get_res.status_code, 200)
        saved_data = get_res.json()
        self.assertEqual(len(saved_data["destination_ids"]), 3)
        self.assertIn("pangong", saved_data["destination_ids"])
        self.assertIn("nubra", saved_data["destination_ids"])
        self.assertEqual(saved_data["notes"], "Himalayan circuit planned for June 2026")

    def test_08_user_custom_trips(self):
        reg_res = client.post("/api/auth/register", json={
            "email": "explorer.arya@example.com",
            "password": "SecurePassword123!",
            "full_name": "Arya Stark"
        })
        token = reg_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create custom trip
        trip_res = client.post("/api/user/trips", headers=headers, json={
            "title": "Ladakh 7-Day High Pass Circuit",
            "destination_ids": ["pangong", "nubra", "khardungla", "hemis"],
            "start_date": "2026-06-15",
            "duration_days": 7,
            "travel_style": "Motorbike Expedition",
            "notes": "Ensure AMS oxygen cylinder and emergency kit"
        })
        self.assertEqual(trip_res.status_code, 200)
        trip_id = trip_res.json()["trip"]["id"]

        # List trips
        list_res = client.get("/api/user/trips", headers=headers)
        self.assertEqual(list_res.status_code, 200)
        trips = list_res.json()["trips"]
        self.assertEqual(len(trips), 1)
        self.assertEqual(trips[0]["title"], "Ladakh 7-Day High Pass Circuit")

        # Delete trip
        del_res = client.delete(f"/api/user/trips/{trip_id}", headers=headers)
        self.assertEqual(del_res.status_code, 200)

        # Confirm deleted
        list_after = client.get("/api/user/trips", headers=headers).json()["trips"]
        self.assertEqual(len(list_after), 0)

    def test_09_guest_to_user_migration(self):
        # 1. Guest saves bookmarks with guest session
        guest_sid = "guest_session_998877"
        guest_save = client.post("/api/journey/save", json={
            "session_id": guest_sid,
            "destination_ids": ["pangong", "nubra"],
            "notes": "Guest discovery list"
        })
        self.assertEqual(guest_save.status_code, 200)

        # 2. Register with guest_session_id
        reg_res = client.post("/api/auth/register", json={
            "email": "migration.test@example.com",
            "password": "MigrationSecret123",
            "full_name": "Converted Guest",
            "guest_session_id": guest_sid
        })
        self.assertEqual(reg_res.status_code, 200)
        token = reg_res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Check /api/user/saved has the guest's bookmarks
        saved_res = client.get("/api/user/saved", headers=headers)
        self.assertEqual(saved_res.status_code, 200)
        dest_ids = saved_res.json()["destination_ids"]
        self.assertIn("pangong", dest_ids)
        self.assertIn("nubra", dest_ids)

    def test_10_unauthorized_access(self):
        # Access protected endpoint without token
        res1 = client.get("/api/auth/me")
        self.assertEqual(res1.status_code, 401)

        # Access protected endpoint with forged token
        res2 = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.token.payload"})
        self.assertEqual(res2.status_code, 401)

if __name__ == "__main__":
    unittest.main(verbosity=2)
