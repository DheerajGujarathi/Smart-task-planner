from flask import Flask, request, jsonify, send_file
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
import json
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Placeholder: In a real app use LangChain + Gemini API
class PlanRequest(BaseModel):
    goal: str
    persona: str = "startup"
    timeline_days: int = 14


@app.route('/generate_plan', methods=['POST'])
def generate_plan():
    data = request.get_json() or {}
    try:
        req = PlanRequest(**data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Intelligent context-aware plan generator
    # Duration allocations depend on persona
    persona = req.persona.lower()
    base = req.timeline_days
    goal_lower = req.goal.lower()

    # Detect goal category and generate appropriate tasks
    mapping = []
    weights = {}
    
    # FITNESS & HEALTH GOALS
    if any(keyword in goal_lower for keyword in ['fitness', 'workout', 'exercise', 'gym', 'weight', 'health', 'diet', 'nutrition', 'body', 'muscle', 'cardio', 'strength', 'transformation']):
        if persona == 'startup':
            weights = {'assessment': 0.1, 'planning': 0.15, 'action': 0.5, 'tracking': 0.15, 'optimization': 0.1}
            mapping = [
                ("Fitness Assessment & Goal Setting", 'assessment'),
                ("Create Workout & Nutrition Plan", 'planning'),
                ("Execute Training Program", 'action'),
                ("Track Progress & Measurements", 'tracking'),
                ("Optimize & Adjust Routine", 'optimization'),
            ]
        elif persona == 'corporate':
            weights = {'assessment': 0.15, 'planning': 0.2, 'action': 0.4, 'tracking': 0.15, 'optimization': 0.1}
            mapping = [
                ("Health & Fitness Assessment", 'assessment'),
                ("Structured Workout Planning", 'planning'),
                ("Disciplined Training Execution", 'action'),
                ("Progress Monitoring & Analytics", 'tracking'),
                ("Performance Optimization", 'optimization'),
            ]
        else:  # creative
            weights = {'inspiration': 0.1, 'planning': 0.2, 'action': 0.4, 'tracking': 0.2, 'celebration': 0.1}
            mapping = [
                ("Find Fitness Inspiration & Vision", 'inspiration'),
                ("Design Creative Workout Plan", 'planning'),
                ("Enjoy Active Lifestyle Changes", 'action'),
                ("Celebrate Progress Milestones", 'tracking'),
                ("Transform into Best Self", 'celebration'),
            ]
    
    # HABITS & BEHAVIOR CHANGE
    elif any(keyword in goal_lower for keyword in ['habit', 'behavior', 'behaviour', 'routine', 'discipline', 'consistency', 'daily', 'morning', 'evening', 'lifestyle', 'change', 'improve', 'build', 'break', 'quit', 'stop']):
        if persona == 'startup':
            weights = {'identify': 0.1, 'design': 0.2, 'implement': 0.4, 'track': 0.2, 'reinforce': 0.1}
            mapping = [
                ("Identify Current Patterns", 'identify'),
                ("Design New Habit System", 'design'),
                ("Implement Daily Practice", 'implement'),
                ("Track & Monitor Progress", 'track'),
                ("Reinforce & Scale Success", 'reinforce'),
            ]
        elif persona == 'corporate':
            weights = {'audit': 0.15, 'strategy': 0.25, 'execution': 0.35, 'measurement': 0.15, 'optimization': 0.1}
            mapping = [
                ("Behavioral Audit & Analysis", 'audit'),
                ("Strategic Habit Framework", 'strategy'),
                ("Systematic Implementation", 'execution'),
                ("Performance Measurement", 'measurement'),
                ("Continuous Optimization", 'optimization'),
            ]
        else:  # creative
            weights = {'explore': 0.15, 'envision': 0.2, 'experiment': 0.35, 'reflect': 0.2, 'celebrate': 0.1}
            mapping = [
                ("Explore Current Patterns", 'explore'),
                ("Envision Ideal Lifestyle", 'envision'),
                ("Experiment with New Habits", 'experiment'),
                ("Reflect on Progress", 'reflect'),
                ("Celebrate Transformation", 'celebrate'),
            ]
    
    # MINDFULNESS & MENTAL WELLNESS
    elif any(keyword in goal_lower for keyword in ['mindfulness', 'meditation', 'mental', 'wellness', 'stress', 'anxiety', 'peace', 'calm', 'focus', 'concentration', 'awareness', 'mindset', 'gratitude', 'positive', 'therapy']):
        if persona == 'startup':
            weights = {'foundation': 0.15, 'practice': 0.4, 'integration': 0.25, 'tracking': 0.15, 'mastery': 0.05}
            mapping = [
                ("Build Mindfulness Foundation", 'foundation'),
                ("Daily Practice & Techniques", 'practice'),
                ("Integrate into Daily Life", 'integration'),
                ("Track Mental Wellness", 'tracking'),
                ("Achieve Inner Mastery", 'mastery'),
            ]
        elif persona == 'corporate':
            weights = {'assessment': 0.2, 'program': 0.25, 'implementation': 0.3, 'monitoring': 0.2, 'optimization': 0.05}
            mapping = [
                ("Mental Wellness Assessment", 'assessment'),
                ("Structured Wellness Program", 'program'),
                ("Systematic Implementation", 'implementation'),
                ("Progress Monitoring", 'monitoring'),
                ("Wellness Optimization", 'optimization'),
            ]
        else:  # creative
            weights = {'discovery': 0.2, 'exploration': 0.25, 'practice': 0.3, 'expression': 0.2, 'integration': 0.05}
            mapping = [
                ("Discover Inner Landscape", 'discovery'),
                ("Explore Wellness Practices", 'exploration'),
                ("Creative Mindfulness Practice", 'practice'),
                ("Express & Journal Insights", 'expression'),
                ("Integrate Wisdom", 'integration'),
            ]
    
    # RELATIONSHIPS & SOCIAL GOALS
    elif any(keyword in goal_lower for keyword in ['relationship', 'social', 'friend', 'family', 'communication', 'connection', 'network', 'dating', 'marriage', 'partnership', 'teamwork', 'leadership', 'conflict']):
        if persona == 'startup':
            weights = {'assessment': 0.15, 'strategy': 0.2, 'action': 0.4, 'feedback': 0.2, 'growth': 0.05}
            mapping = [
                ("Assess Current Relationships", 'assessment'),
                ("Develop Connection Strategy", 'strategy'),
                ("Take Social Action", 'action'),
                ("Gather Feedback & Adjust", 'feedback'),
                ("Deepen Relationships", 'growth'),
            ]
        elif persona == 'corporate':
            weights = {'analysis': 0.2, 'planning': 0.25, 'implementation': 0.3, 'evaluation': 0.2, 'improvement': 0.05}
            mapping = [
                ("Relationship Analysis", 'analysis'),
                ("Communication Planning", 'planning'),
                ("Systematic Implementation", 'implementation'),
                ("Relationship Evaluation", 'evaluation'),
                ("Continuous Improvement", 'improvement'),
            ]
        else:  # creative
            weights = {'reflection': 0.2, 'vision': 0.2, 'expression': 0.35, 'connection': 0.2, 'harmony': 0.05}
            mapping = [
                ("Reflect on Connections", 'reflection'),
                ("Envision Ideal Relationships", 'vision'),
                ("Express Authentic Self", 'expression'),
                ("Deepen Connections", 'connection'),
                ("Create Relationship Harmony", 'harmony'),
            ]
    
    # FINANCIAL & LIFE ORGANIZATION
    elif any(keyword in goal_lower for keyword in ['financial', 'money', 'budget', 'save', 'invest', 'debt', 'organize', 'declutter', 'minimalism', 'productivity', 'time', 'management', 'goals', 'planning']):
        if persona == 'startup':
            weights = {'audit': 0.15, 'strategy': 0.25, 'implementation': 0.35, 'tracking': 0.2, 'optimization': 0.05}
            mapping = [
                ("Life Audit & Assessment", 'audit'),
                ("Create Action Strategy", 'strategy'),
                ("Implement Systems", 'implementation'),
                ("Track Progress & Metrics", 'tracking'),
                ("Optimize & Scale", 'optimization'),
            ]
        elif persona == 'corporate':
            weights = {'analysis': 0.2, 'planning': 0.3, 'execution': 0.25, 'monitoring': 0.2, 'review': 0.05}
            mapping = [
                ("Comprehensive Analysis", 'analysis'),
                ("Strategic Planning", 'planning'),
                ("Disciplined Execution", 'execution'),
                ("Performance Monitoring", 'monitoring'),
                ("Quarterly Review", 'review'),
            ]
        else:  # creative
            weights = {'vision': 0.2, 'design': 0.25, 'creation': 0.3, 'refinement': 0.2, 'celebration': 0.05}
            mapping = [
                ("Envision Ideal Life", 'vision'),
                ("Design Life Systems", 'design'),
                ("Create New Patterns", 'creation'),
                ("Refine & Adjust", 'refinement'),
                ("Celebrate Success", 'celebration'),
            ]
    
    # PERSONAL GROWTH & SPIRITUALITY
    elif any(keyword in goal_lower for keyword in ['personal', 'growth', 'spiritual', 'purpose', 'meaning', 'values', 'identity', 'confidence', 'self-esteem', 'wisdom', 'enlightenment', 'journey', 'awakening', 'consciousness']):
        if persona == 'startup':
            weights = {'discovery': 0.2, 'exploration': 0.25, 'practice': 0.3, 'integration': 0.2, 'mastery': 0.05}
            mapping = [
                ("Self-Discovery Process", 'discovery'),
                ("Explore Growth Paths", 'exploration'),
                ("Daily Growth Practice", 'practice'),
                ("Integrate New Insights", 'integration'),
                ("Embody Transformation", 'mastery'),
            ]
        elif persona == 'corporate':
            weights = {'assessment': 0.25, 'development': 0.3, 'implementation': 0.25, 'evaluation': 0.15, 'advancement': 0.05}
            mapping = [
                ("Personal Assessment", 'assessment'),
                ("Development Planning", 'development'),
                ("Structured Implementation", 'implementation'),
                ("Progress Evaluation", 'evaluation'),
                ("Advanced Growth", 'advancement'),
            ]
        else:  # creative
            weights = {'awakening': 0.2, 'exploration': 0.25, 'expression': 0.3, 'integration': 0.2, 'wisdom': 0.05}
            mapping = [
                ("Spiritual Awakening", 'awakening'),
                ("Explore Inner Wisdom", 'exploration'),
                ("Express Authentic Self", 'expression'),
                ("Integrate Experiences", 'integration'),
                ("Embody Wisdom", 'wisdom'),
            ]
    
    # LEARNING & EDUCATION GOALS
    elif any(keyword in goal_lower for keyword in ['learn', 'study', 'course', 'skill', 'education', 'training', 'knowledge', 'master', 'certification', 'language']):
        if persona == 'startup':
            weights = {'research': 0.1, 'planning': 0.15, 'learning': 0.5, 'practice': 0.2, 'mastery': 0.05}
        elif persona == 'corporate':
            weights = {'research': 0.15, 'planning': 0.2, 'learning': 0.4, 'practice': 0.2, 'mastery': 0.05}
        else:  # creative
            weights = {'exploration': 0.15, 'planning': 0.15, 'learning': 0.4, 'practice': 0.25, 'mastery': 0.05}
            
        mapping = [
            ("Research Learning Resources", 'research' if persona != 'creative' else 'exploration'),
            ("Create Study Schedule", 'planning'),
            ("Active Learning & Absorption", 'learning'),
            ("Hands-on Practice & Application", 'practice'),
            ("Achieve Mastery & Certification", 'mastery'),
        ]
    
    # BUSINESS & CAREER GOALS
    elif any(keyword in goal_lower for keyword in ['business', 'startup', 'career', 'job', 'promotion', 'company', 'entrepreneur', 'revenue', 'sales', 'marketing']):
        if persona == 'startup':
            weights = {'research': 0.15, 'planning': 0.2, 'execution': 0.35, 'testing': 0.2, 'launch': 0.1}
        elif persona == 'corporate':
            weights = {'research': 0.2, 'planning': 0.25, 'execution': 0.25, 'testing': 0.2, 'launch': 0.1}
        else:  # creative
            weights = {'inspiration': 0.15, 'planning': 0.25, 'execution': 0.3, 'testing': 0.15, 'launch': 0.15}
            
        mapping = [
            ("Market Research & Analysis", 'research' if persona != 'creative' else 'inspiration'),
            ("Strategic Planning & Design", 'planning'),
            ("Build & Execute Strategy", 'execution'),
            ("Test & Validate Approach", 'testing'),
            ("Launch & Scale Results", 'launch'),
        ]
    
    # CREATIVE & PERSONAL PROJECTS
    elif any(keyword in goal_lower for keyword in ['creative', 'art', 'music', 'writing', 'book', 'blog', 'project', 'hobby', 'craft', 'design']):
        if persona == 'startup':
            weights = {'ideation': 0.15, 'planning': 0.2, 'creation': 0.4, 'refinement': 0.15, 'sharing': 0.1}
        elif persona == 'corporate':
            weights = {'research': 0.2, 'planning': 0.25, 'creation': 0.3, 'refinement': 0.15, 'presentation': 0.1}
        else:  # creative
            weights = {'inspiration': 0.2, 'exploration': 0.15, 'creation': 0.4, 'refinement': 0.15, 'celebration': 0.1}
            
        mapping = [
            ("Gather Inspiration & Ideas", 'ideation' if persona == 'startup' else ('research' if persona == 'corporate' else 'inspiration')),
            ("Plan Creative Process", 'planning' if persona != 'creative' else 'exploration'),
            ("Create & Develop Work", 'creation'),
            ("Refine & Perfect", 'refinement'),
            ("Share & Celebrate", 'sharing' if persona == 'startup' else ('presentation' if persona == 'corporate' else 'celebration')),
        ]
    
    # DEFAULT DEVELOPMENT TASKS (fallback)
    else:
        if persona == 'startup':
            weights = {'research': 0.15, 'design': 0.2, 'development': 0.35, 'testing': 0.2, 'launch': 0.1}
        elif persona == 'corporate':
            weights = {'research': 0.2, 'design': 0.25, 'development': 0.25, 'testing': 0.2, 'launch': 0.1}
        else:  # creative
            weights = {'research': 0.2, 'design': 0.35, 'development': 0.2, 'testing': 0.15, 'launch': 0.1}
            
        mapping = [
            ("Research & Analysis", 'research'),
            ("Design & Planning", 'design'),
            ("Development & Implementation", 'development'),
            ("Testing & Quality Assurance", 'testing'),
            ("Launch & Delivery", 'launch'),
        ]

    tasks = []
    start = datetime.utcnow()
    cursor = start

    for name, key in mapping:
        dur = max(1, round(base * weights[key]))
        end = cursor + timedelta(days=dur)
        tasks.append({
            "task": name,
            "duration_days": dur,
            "start": cursor.isoformat(),
            "end": end.isoformat(),
            "dependsOn": [],
            "priority": "High" if key in ['research','design','launch'] else "Medium"
        })
        # next task starts after end
        cursor = end

    plan = {
        "goal": req.goal,
        "persona": req.persona,
        "generated_at": datetime.utcnow().isoformat(),
        "timeline_days": req.timeline_days,
        "tasks": tasks
    }

    # Context-aware reasoning and critique
    critique = []
    goal_lower = req.goal.lower()
    
    # Fitness-specific insights
    if any(keyword in goal_lower for keyword in ['fitness', 'workout', 'exercise', 'gym', 'weight', 'health', 'diet', 'nutrition', 'body', 'muscle', 'cardio', 'strength', 'transformation']):
        total_action = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['training', 'execute', 'active', 'lifestyle']))
        total_planning = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['plan', 'create', 'design']))
        
        if total_planning > total_action * 0.5:
            critique.append("Consider more time for actual training - consistency is key for fitness transformations!")
        
        if req.timeline_days < 21:
            critique.append("Fitness transformations show best results over 6-12 weeks. Consider extending your timeline.")
        else:
            critique.append("Great timeline choice! This gives enough time to build sustainable fitness habits.")
    
    # Habits & Behavior insights
    elif any(keyword in goal_lower for keyword in ['habit', 'behavior', 'behaviour', 'routine', 'discipline', 'consistency', 'daily', 'morning', 'evening', 'lifestyle', 'change', 'improve', 'build', 'break', 'quit', 'stop']):
        total_practice = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['implement', 'practice', 'execute', 'experiment']))
        total_design = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['design', 'strategy', 'plan']))
        
        if req.timeline_days < 21:
            critique.append("Habit formation typically takes 21-66 days. Consider a longer timeline for lasting change.")
        
        if total_practice < req.timeline_days * 0.4:
            critique.append("Increase daily practice time - consistency is the foundation of habit formation!")
        else:
            critique.append("Excellent focus on daily practice - this approach builds lasting behavioral change.")
    
    # Mindfulness & Mental Wellness insights
    elif any(keyword in goal_lower for keyword in ['mindfulness', 'meditation', 'mental', 'wellness', 'stress', 'anxiety', 'peace', 'calm', 'focus', 'concentration', 'awareness', 'mindset', 'gratitude', 'positive', 'therapy']):
        total_practice = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['practice', 'daily', 'meditation', 'mindfulness']))
        
        if total_practice < req.timeline_days * 0.3:
            critique.append("Mental wellness benefits from daily practice - consider more consistent mindfulness time.")
        else:
            critique.append("Great emphasis on daily practice - mindfulness grows stronger with consistency.")
        
        if req.timeline_days >= 30:
            critique.append("Perfect timeline for developing deep mindfulness habits and experiencing mental wellness benefits.")
    
    # Relationships & Social insights
    elif any(keyword in goal_lower for keyword in ['relationship', 'social', 'friend', 'family', 'communication', 'connection', 'network', 'dating', 'marriage', 'partnership', 'teamwork', 'leadership', 'conflict']):
        total_action = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['action', 'express', 'connect', 'implement']))
        total_reflection = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['assess', 'reflect', 'analysis']))
        
        if total_reflection > total_action:
            critique.append("Relationships grow through action - consider more time for actual social engagement!")
        else:
            critique.append("Great balance of reflection and action - relationships thrive with intentional engagement.")
        
        critique.append("Remember: authentic connections take time to develop - be patient with the process.")
    
    # Financial & Life Organization insights
    elif any(keyword in goal_lower for keyword in ['financial', 'money', 'budget', 'save', 'invest', 'debt', 'organize', 'declutter', 'minimalism', 'productivity', 'time', 'management', 'goals', 'planning']):
        total_implementation = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['implement', 'execute', 'create', 'systems']))
        total_planning = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['plan', 'strategy', 'analysis']))
        
        if total_planning > total_implementation:
            critique.append("Life organization benefits from action over planning - start implementing systems quickly!")
        else:
            critique.append("Excellent action focus - organized systems compound their benefits over time.")
        
        critique.append("Small, consistent changes in organization create dramatic long-term improvements.")
    
    # Personal Growth & Spirituality insights
    elif any(keyword in goal_lower for keyword in ['personal', 'growth', 'spiritual', 'purpose', 'meaning', 'values', 'identity', 'confidence', 'self-esteem', 'wisdom', 'enlightenment', 'journey', 'awakening', 'consciousness']):
        total_practice = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['practice', 'daily', 'implement', 'express']))
        total_exploration = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['explore', 'discover', 'assess']))
        
        if total_exploration > total_practice:
            critique.append("Personal growth accelerates with daily practice - balance exploration with consistent action.")
        else:
            critique.append("Beautiful balance of discovery and practice - this creates sustainable personal transformation.")
        
        if req.timeline_days >= 90:
            critique.append("Extended timeline perfect for deep personal transformation - growth is a lifelong journey.")
        else:
            critique.append("Good starting timeline for personal growth - consider extending for deeper transformation.")
    
    # Learning-specific insights
    elif any(keyword in goal_lower for keyword in ['learn', 'study', 'course', 'skill', 'education', 'training', 'knowledge', 'master', 'certification', 'language']):
        total_practice = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['practice', 'application', 'hands-on']))
        total_learning = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['learning', 'study', 'absorption']))
        
        if total_practice < total_learning * 0.3:
            critique.append("Add more hands-on practice time - applying knowledge is crucial for retention!")
        else:
            critique.append("Good balance of learning and practice - this approach maximizes skill retention.")
    
    # Business-specific insights
    elif any(keyword in goal_lower for keyword in ['business', 'startup', 'career', 'job', 'promotion', 'company', 'entrepreneur', 'revenue', 'sales', 'marketing']):
        total_execution = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['execute', 'build', 'implementation']))
        total_planning = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['planning', 'research', 'analysis']))
        
        if total_planning > total_execution:
            critique.append("Consider more execution time - taking action is often more valuable than perfect planning.")
        else:
            critique.append("Great action-oriented approach! Execution beats perfection in business.")
    
    # Creative project insights
    elif any(keyword in goal_lower for keyword in ['creative', 'art', 'music', 'writing', 'book', 'blog', 'project', 'hobby', 'craft', 'design']):
        total_creation = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['create', 'develop', 'work']))
        total_inspiration = sum(t['duration_days'] for t in tasks if any(word in t['task'].lower() for word in ['inspiration', 'ideas', 'research']))
        
        if total_inspiration < total_creation * 0.2:
            critique.append("Consider more inspiration time - creative work benefits from diverse input sources.")
        else:
            critique.append("Nice balance of inspiration and creation - this supports sustained creative flow.")
    
    # Generic insights for development projects
    else:
        total_design = sum(t['duration_days'] for t in tasks if 'Design' in t['task'])
        total_development = sum(t['duration_days'] for t in tasks if any(word in t['task'] for word in ['Development', 'Backend', 'Implementation']))
        
        if total_design > total_development:
            critique.append("Design phase is longer than development; consider parallelizing development work.")
        else:
            critique.append("Good development focus - implementation often takes more time than initially planned.")

    plan['critique'] = critique

    return jsonify(plan)


@app.route('/export/pdf', methods=['POST'])
def export_pdf():
    data = request.get_json() or {}
    plan = data.get('plan')
    if not plan:
        return jsonify({"error": "No plan provided"}), 400

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setFont('Helvetica', 12)
    c.drawString(30, 750, f"Goal: {plan.get('goal')}")
    c.drawString(30, 735, f"Persona: {plan.get('persona')}")
    y = 710
    for t in plan.get('tasks', []):
        c.drawString(30, y, f"- {t['task']}: {t['duration_days']} days ({t['start'][:10]} -> {t['end'][:10]})")
        y -= 15
        if y < 50:
            c.showPage()
            y = 750
    c.showPage()
    c.save()
    buffer.seek(0)

    return send_file(buffer, mimetype='application/pdf', download_name='plan.pdf')


if __name__ == '__main__':
    app.run(port=5001, debug=True)
