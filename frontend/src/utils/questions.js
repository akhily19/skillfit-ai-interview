/**
 * Interview Questions Configuration
 * Multilingual question sets for SkillFit AI
 */
export const INTERVIEW_QUESTIONS = {
  English: [
    {
      id: 'q1',
      text: 'Please introduce yourself. Tell us your name, education, and background.',
      hint: 'Speak clearly for 30–60 seconds',
      category: 'introduction',
      maxDuration: 90,
    },
    {
      id: 'q2',
      text: 'What are your main skills and areas of expertise? How long have you been working in this field?',
      hint: 'Mention specific skills and years of experience',
      category: 'skills',
      maxDuration: 90,
    },
    {
      id: 'q3',
      text: 'Describe your previous work experience. What roles have you held and what did you learn?',
      hint: 'Give specific examples of your work',
      category: 'experience',
      maxDuration: 90,
    },
    {
      id: 'q4',
      text: 'Why should we select you for this opportunity? What makes you the right candidate?',
      hint: 'Be confident and specific',
      category: 'motivation',
      maxDuration: 90,
    },
  ],
  Hindi: [
    {
      id: 'q1',
      text: 'कृपया अपना परिचय दें। अपना नाम, शिक्षा और पृष्ठभूमि बताएं।',
      hint: '30-60 सेकंड स्पष्ट रूप से बोलें',
      category: 'introduction',
      maxDuration: 90,
    },
    {
      id: 'q2',
      text: 'आपके मुख्य कौशल क्या हैं? आप इस क्षेत्र में कितने समय से काम कर रहे हैं?',
      hint: 'विशिष्ट कौशल और अनुभव बताएं',
      category: 'skills',
      maxDuration: 90,
    },
    {
      id: 'q3',
      text: 'अपने पिछले कार्य अनुभव का वर्णन करें। आपने पहले कौन से पद संभाले हैं?',
      hint: 'अपने काम के उदाहरण दें',
      category: 'experience',
      maxDuration: 90,
    },
    {
      id: 'q4',
      text: 'हमें आपको इस अवसर के लिए क्यों चुनना चाहिए? आप सही उम्मीदवार क्यों हैं?',
      hint: 'आत्मविश्वास से उत्तर दें',
      category: 'motivation',
      maxDuration: 90,
    },
  ],
  Kannada: [
    {
      id: 'q1',
      text: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳಿ. ನಿಮ್ಮ ಹೆಸರು, ಶಿಕ್ಷಣ ಮತ್ತು ಹಿನ್ನೆಲೆ ಹೇಳಿ.',
      hint: '30-60 ಸೆಕೆಂಡ್ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತಾಡಿ',
      category: 'introduction',
      maxDuration: 90,
    },
    {
      id: 'q2',
      text: 'ನಿಮ್ಮ ಮುಖ್ಯ ಕೌಶಲ್ಯಗಳೇನು? ನೀವು ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ಎಷ್ಟು ವರ್ಷ ಕೆಲಸ ಮಾಡಿದ್ದೀರಿ?',
      hint: 'ನಿರ್ದಿಷ್ಟ ಕೌಶಲ್ಯ ಮತ್ತು ಅನುಭವ ಹೇಳಿ',
      category: 'skills',
      maxDuration: 90,
    },
    {
      id: 'q3',
      text: 'ನಿಮ್ಮ ಹಿಂದಿನ ಕೆಲಸದ ಅನುಭವ ವಿವರಿಸಿ. ನೀವು ಮೊದಲು ಯಾವ ಹುದ್ದೆ ಹೊಂದಿದ್ದಿರಿ?',
      hint: 'ನಿಮ್ಮ ಕೆಲಸದ ಉದಾಹರಣೆಗಳನ್ನು ಹೇಳಿ',
      category: 'experience',
      maxDuration: 90,
    },
    {
      id: 'q4',
      text: 'ನಾವು ನಿಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು? ನೀವು ಸರಿಯಾದ ಅಭ್ಯರ್ಥಿ ಏಕೆ?',
      hint: 'ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಉತ್ತರಿಸಿ',
      category: 'motivation',
      maxDuration: 90,
    },
  ],
};

export const getQuestions = (language) =>
  INTERVIEW_QUESTIONS[language] || INTERVIEW_QUESTIONS.English;
