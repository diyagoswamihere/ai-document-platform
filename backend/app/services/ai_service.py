import google.generativeai as genai
from app.config import get_settings
from typing import List, Dict

settings = get_settings()

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

class AIService:
    """Service for AI content generation using Gemini"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_content(self, prompt: str) -> str:
        """Generate content using Gemini API"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"AI generation failed: {str(e)}")
    
    def generate_document_outline(self, topic: str, document_type: str, num_sections: int = 5) -> List[str]:
        """Generate an outline for a document"""
        if document_type == "docx":
            prompt = f"""Generate {num_sections} section titles for a professional Word document about: {topic}
            
Return only the section titles, one per line, without numbering or extra formatting.
Example format:
Introduction
Background and Context
Main Analysis
Key Findings
Conclusion"""
        else:  # pptx
            prompt = f"""Generate {num_sections} slide titles for a professional PowerPoint presentation about: {topic}
            
Return only the slide titles, one per line, without numbering or extra formatting.
Example format:
Introduction to {topic}
Key Concepts
Main Points
Analysis and Insights
Conclusion and Next Steps"""
        
        try:
            response = self.model.generate_content(prompt)
            # Split response into lines and clean up
            titles = [line.strip() for line in response.text.split('\n') if line.strip()]
            return titles[:num_sections]  # Return exactly num_sections titles
        except Exception as e:
            raise Exception(f"Outline generation failed: {str(e)}")
    
    def generate_section_content(
        self, 
        topic: str, 
        section_title: str, 
        document_type: str,
        additional_context: str = ""
    ) -> str:
        """Generate content for a specific section/slide"""
        if document_type == "docx":
            prompt = f"""Write professional content for a Word document section.

Document Topic: {topic}
Section Title: {section_title}
{f'Additional Context: {additional_context}' if additional_context else ''}

Write 2-3 well-structured paragraphs (150-250 words) with clear, professional content.
Do not include the section title in your response, only the content."""
        else:  # pptx
            prompt = f"""Write concise content for a PowerPoint slide.

Presentation Topic: {topic}
Slide Title: {section_title}
{f'Additional Context: {additional_context}' if additional_context else ''}

Write 3-5 bullet points with clear, concise content suitable for a presentation slide.
Format each point on a new line starting with a bullet point (•).
Keep each point to 1-2 sentences maximum."""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Content generation failed: {str(e)}")
    
    def refine_content(
        self, 
        original_content: str, 
        refinement_instruction: str,
        document_type: str
    ) -> str:
        """Refine existing content based on user instructions"""
        prompt = f"""You are refining content for a {'Word document' if document_type == 'docx' else 'PowerPoint presentation'}.

Original Content:
{original_content}

User's Refinement Request:
{refinement_instruction}

Please provide the refined version of the content following the user's instructions.
Maintain professional tone and appropriate length for the document type."""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            raise Exception(f"Content refinement failed: {str(e)}")