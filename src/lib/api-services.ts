
/**
 * Services pour les appels directs aux APIs (IA et Emails)
 * Note: Ces appels utilisent les clés VITE_* du fichier .env
 */

export const AIService = {
  async callAI(prompt: string, systemPrompt: string): Promise<string> {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    // Tentative avec OpenAI
    if (OPENAI_API_KEY && OPENAI_API_KEY.trim()) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }
      } catch (e) {
        console.error("OpenAI error:", e);
      }
    }

    // Tentative avec Gemini
    if (GEMINI_API_KEY && GEMINI_API_KEY.trim()) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
              generationConfig: { temperature: 0.7 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (e) {
        console.error("Gemini error:", e);
      }
    }

    throw new Error("Aucune clé API IA configurée ou erreur réseau");
  },

  async generateModule(courseTitle: string, level: string, moduleNumber: number): Promise<any> {
    const prompt = `Tu es un expert pédagogique. Génère le contenu du module ${moduleNumber}/10 pour le cours "${courseTitle}" (niveau: ${level}).
    
    Retourne UNIQUEMENT un JSON valide (pas de markdown, pas de \`\`\`) avec cette structure exacte:
    {
      "title": "Titre du module ${moduleNumber}",
      "explanation": "Explication détaillée du concept (minimum 300 mots, avec paragraphes)",
      "examples": [
        {"title": "Exemple 1", "code": "code exemple si applicable", "description": "Description de l'exemple"},
        {"title": "Exemple 2", "code": "code exemple si applicable", "description": "Description de l'exemple"}
      ],
      "exercise": {"title": "Exercice pratique", "description": "Description de l'exercice", "hint": "Indice"},
      "qcm_questions": [
        {"question": "Question ?", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "Explication"}
      ],
      "open_questions": [
        {"question": "Question ouverte ?", "expected_answer": "Réponse attendue"}
      ]
    }
    
    Génère exactement 20 questions QCM et 4 questions ouvertes. Le contenu doit être en français.`;

    const systemPrompt = "Tu es un générateur de contenu pédagogique. Tu réponds UNIQUEMENT en JSON valide, sans markdown.";
    
    const raw = await this.callAI(prompt, systemPrompt);
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  },

  async evaluateAnswers(params: {
    qcmQuestions: any[],
    openQuestions: any[],
    answers: { qcm: any, open: any },
  }): Promise<any> {
    const { qcmQuestions, openQuestions, answers } = params;

    // Note QCM locale
    let qcmScore = 0;
    qcmQuestions.forEach((q, i) => {
      if (answers.qcm && answers.qcm[i] === q.correct) qcmScore++;
    });

    const qcmPercent = qcmQuestions.length > 0 ? (qcmScore / qcmQuestions.length) * 100 : 0;

    // Note Questions Ouvertes via IA
    let openScore = 0;
    if (openQuestions.length > 0 && answers.open) {
      const openAnswersArr = Object.values(answers.open) as string[];
      const gradingPrompt = openQuestions.map((q: any, i: number) =>
        `Question ${i + 1}: ${q.question}\nRéponse attendue: ${q.expected_answer}\nRéponse de l'apprenant: ${openAnswersArr[i] || "(pas de réponse)"}`
      ).join("\n\n");

      const systemPrompt = `Tu es un correcteur bienveillant. Tu dois noter ${openQuestions.length} réponses, chacune sur 5 points. Sois juste. Réponds UNIQUEMENT en JSON valide : {"scores": [5, 3, 4, 2]}`;
      
      const aiResponse = await this.callAI(gradingPrompt, systemPrompt);
      try {
        const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const scores = parsed.scores || [];
        openScore = scores.reduce((a: number, b: number) => a + b, 0);
      } catch (e) {
        console.error("AI grading parsing error:", e);
        openScore = openQuestions.length * 3; // Fallback partial credit
      }
    }

    const openTotal = openQuestions.length * 5;
    const openPercent = openTotal > 0 ? (openScore / openTotal) * 100 : 0;

    return {
      qcmScore,
      qcmPercent,
      openScore,
      openPercent,
      totalScore: (qcmPercent * 0.7) + (openPercent * 0.3)
    };
  }
};

export const EmailService = {
  async sendEmail(params: {
    to: string,
    subject: string,
    html: string
  }): Promise<boolean> {
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.warn("Pas de clé Resend configurée");
      return false;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "SkillFlash <onboarding@resend.dev>",
          to: [params.to],
          subject: params.subject,
          html: params.html,
        }),
      });

      return response.ok;
    } catch (e) {
      console.error("Resend error:", e);
      return false;
    }
  }
};
