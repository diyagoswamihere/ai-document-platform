from app.services.ai_service import AIService

def test_ai():
    print("Testing Gemini AI Integration...\n")
    
    ai = AIService()
    
    # Test 1: Generate outline
    print("=" * 50)
    print("Test 1: Generate Document Outline")
    print("=" * 50)
    topic = "Artificial Intelligence in Healthcare"
    outline = ai.generate_document_outline(topic, "docx", 5)
    print(f"Topic: {topic}")
    print("\nGenerated Outline:")
    for i, title in enumerate(outline, 1):
        print(f"{i}. {title}")
    
    # Test 2: Generate section content
    print("\n" + "=" * 50)
    print("Test 2: Generate Section Content")
    print("=" * 50)
    if outline:
        section_title = outline[0]
        content = ai.generate_section_content(topic, section_title, "docx")
        print(f"Section: {section_title}")
        print(f"\nGenerated Content:\n{content}")
    
    print("\n" + "=" * 50)
    print("✓ AI Integration Test Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_ai()