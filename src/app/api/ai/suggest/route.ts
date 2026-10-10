import { NextResponse } from 'next/server';
import { AiTaskSuggestion, TaskPriority } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goal, count = 4 } = body;

    if (!goal || typeof goal !== 'string' || goal.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Fadlan geli hadafkaaga ama mashruuca aad rabto inaad qorshayso' },
        { status: 400 }
      );
    }

    const trimmedGoal = goal.trim();
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey && openaiApiKey.trim() && !openaiApiKey.includes('placeholder')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert AI productivity planner and project manager.
Break down the user's goal or project into ${count} concrete, actionable tasks.
For each task, provide:
- "title": concise actionable title (3-7 words)
- "description": clear explanation of what needs to be done and success criteria (1-2 sentences)
- "priority": one of ["high", "medium", "low"]

Respond ONLY with valid JSON array of objects, e.g.:
[
  { "title": "...", "description": "...", "priority": "high" }
]
No markdown formatting, no code blocks, just raw JSON.`,
              },
              {
                role: 'user',
                content: `Goal/Project: "${trimmedGoal}"`,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawContent = data.choices?.[0]?.message?.content?.trim();
          if (rawContent) {
            // Clean up possible markdown code fences if OpenAI included them
            const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
            const parsedSuggestions = JSON.parse(cleanJson);
            if (Array.isArray(parsedSuggestions) && parsedSuggestions.length > 0) {
              const formattedSuggestions: AiTaskSuggestion[] = parsedSuggestions.map((item) => ({
                title: String(item.title || ''),
                description: String(item.description || ''),
                priority: (['high', 'medium', 'low'].includes(item.priority)
                  ? item.priority
                  : 'medium') as TaskPriority,
              }));

              return NextResponse.json({
                success: true,
                suggestions: formattedSuggestions,
                source: 'openai',
              });
            }
          }
        } else {
          console.warn('OpenAI request failed with status:', response.status);
        }
      } catch (openAiError) {
        console.warn('OpenAI API call error, falling back to smart planner:', openAiError);
      }
    }

    // Fallback: Smart Rule-Based & Goal Decomposer Engine
    const smartSuggestions = generateSmartSuggestions(trimmedGoal, count);

    return NextResponse.json({
      success: true,
      suggestions: smartSuggestions,
      source: 'smart_planner',
    });
  } catch (error) {
    console.error('AI Suggest API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Khalad ayaa dhacay intii lagu jiray soo saarista talooyinka AI' },
      { status: 500 }
    );
  }
}

function generateSmartSuggestions(goal: string, targetCount: number = 4): AiTaskSuggestion[] {
  const lower = goal.toLowerCase();

  if (
    lower.includes('next') ||
    lower.includes('web') ||
    lower.includes('app') ||
    lower.includes('code') ||
    lower.includes('software')
  ) {
    const devTasks: AiTaskSuggestion[] = [
      {
        title: `Qorshaynta Architecture-ka: ${goal.slice(0, 30)}`,
        description: 'Qeex qaab-dhismeedka mashruuca, qaybaha ugu muhiimsan, iyo xogta database-ka.',
        priority: 'high',
      },
      {
        title: 'Dhisidda Core Features & API Endpoints',
        description: 'Hirgeli shaqooyinka asaasiga ah iyo isku xirka macluumaadka si hufan.',
        priority: 'high',
      },
      {
        title: 'Tijaabinta UI & Hubinta Amniga',
        description: 'Tijaabi user experience-ka, habacsanaanta xawaaraha, iyo dhowridda amniga xogta.',
        priority: 'medium',
      },
      {
        title: 'Deploy to Production & Monitoring',
        description: 'U faafi mashruuca live deegaanka (Vercel) oo hubi in analytics iyo kormeerku shaqaynayaan.',
        priority: 'medium',
      },
    ];
    return devTasks.slice(0, targetCount);
  }

  if (
    lower.includes('suuq') ||
    lower.includes('market') ||
    lower.includes('sales') ||
    lower.includes('ganacsi') ||
    lower.includes('business')
  ) {
    const bizTasks: AiTaskSuggestion[] = [
      {
        title: `Baaritaanka Bartilmaameedka: ${goal.slice(0, 30)}`,
        description: 'Aqoonso macaamiisha saxda ah iyo baahidooda asaasiga ah.',
        priority: 'high',
      },
      {
        title: 'Diyaarinta Farriinta & Content Strategy',
        description: 'Qor qoraallo qancinaya macaamiisha oo muujinaya qiimaha badeecada ama adeegga.',
        priority: 'high',
      },
      {
        title: 'Bilaabista Olole Xayeysiis & Outreach',
        description: 'Fidi farriinta adigoo adeegsanaya baraha bulshada iyo xiriir toos ah.',
        priority: 'medium',
      },
      {
        title: 'Qiimaynta Natiijooyinka & Kobcinta',
        description: 'Kormeeri conversion rate-ka oo hagaaji meelaha gaabiska ah.',
        priority: 'low',
      },
    ];
    return bizTasks.slice(0, targetCount);
  }

  // General Goal Decomposition (SMART structure)
  const generalTasks: AiTaskSuggestion[] = [
    {
      title: `Qeexidda Hadafka & Baaritaanka: ${goal.slice(0, 25)}`,
      description: 'Soo ururi agabka, xogta, iyo tallaabooyinka muhiimka ah ee loo baahan yahay.',
      priority: 'high',
    },
    {
      title: 'Tallaabada 1aad: Fulinta Qaybta Koowaad',
      description: 'Bilow qodobka ugu saamaynta badan si aad u hesho natiijo hore oo dhiirigelin leh.',
      priority: 'high',
    },
    {
      title: 'Dib-u-eegid & Hagaajinta Caqabadaha',
      description: 'Qiimee horumarka la gaaray oo xali caqabadaha soo kordhay.',
      priority: 'medium',
    },
    {
      title: 'Dhamaystira & Gabagabada Natiijada',
      description: 'Xaqiiji in dhammaan shuruudihii la dhamaystiray oo hadafku si buuxda u hirgalay.',
      priority: 'medium',
    },
  ];

  return generalTasks.slice(0, targetCount);
}
