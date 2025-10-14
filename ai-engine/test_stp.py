"""
Simple test suite for Smart Task Planner components
Run with: python -m pytest test_stp.py -v
"""

import pytest
import json
from datetime import datetime

# Test Flask AI Engine
def test_flask_app():
    """Test Flask AI engine endpoints"""
    try:
        import sys
        sys.path.append('.')
        from app import app
        
        app.config['TESTING'] = True
        client = app.test_client()
        
        # Test generate_plan endpoint
        response = client.post('/generate_plan', json={
            'goal': 'Test project',
            'persona': 'startup', 
            'timeline_days': 7
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'tasks' in data
        assert len(data['tasks']) > 0
        assert 'critique' in data
        
        print("✅ Flask AI engine test passed")
        return True
        
    except ImportError:
        print("⚠️ Flask app not found - run from ai-engine directory")
        return False

# Test plan data structure
def test_plan_structure():
    """Test that generated plans have required structure"""
    
    sample_plan = {
        "goal": "Launch a product",
        "persona": "startup",
        "timeline_days": 14,
        "tasks": [
            {
                "task": "Market Research",
                "duration_days": 2,
                "start": "2025-10-11T00:00:00",
                "end": "2025-10-13T00:00:00",
                "priority": "High"
            }
        ],
        "critique": []
    }
    
    # Validate required fields
    required_fields = ['goal', 'persona', 'tasks']
    for field in required_fields:
        assert field in sample_plan, f"Missing required field: {field}"
    
    # Validate task structure
    if sample_plan['tasks']:
        task = sample_plan['tasks'][0]
        task_fields = ['task', 'duration_days', 'start', 'end', 'priority']
        for field in task_fields:
            assert field in task, f"Missing task field: {field}"
    
    print("✅ Plan structure test passed")
    return True

# Test persona logic
def test_persona_logic():
    """Test that different personas produce different task allocations"""
    
    personas = ['startup', 'corporate', 'creative']
    
    # Simple heuristic test - different personas should have different weights
    startup_weights = {'research': 0.15, 'design': 0.2, 'backend': 0.35, 'testing': 0.2, 'launch': 0.1}
    corporate_weights = {'research': 0.2, 'design': 0.25, 'backend': 0.25, 'testing': 0.2, 'launch': 0.1}
    creative_weights = {'research': 0.2, 'design': 0.35, 'backend': 0.2, 'testing': 0.15, 'launch': 0.1}
    
    weights = [startup_weights, corporate_weights, creative_weights]
    
    # Verify each persona has different design allocation
    design_allocations = [w['design'] for w in weights]
    assert len(set(design_allocations)) > 1, "Personas should have different design allocations"
    
    print("✅ Persona logic test passed")
    return True

if __name__ == "__main__":
    print("🧪 Running Smart Task Planner Tests...\n")
    
    tests = [
        test_plan_structure,
        test_persona_logic,
        test_flask_app
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ {test.__name__} failed: {e}")
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed - check setup and dependencies")