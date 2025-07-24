import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Send, User, Bot, Languages } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
}

interface ChatInterfaceProps {
  onDiagnosisComplete?: (diagnosis: any) => void;
}

export const ChatInterface = ({ onDiagnosisComplete }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help assess your symptoms and provide guidance. How are you feeling today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'en' ? 'en-US' : currentLanguage;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message",
          variant: "destructive"
        });
      };
      
      recognitionRef.current = recognition;
    }
  }, [currentLanguage, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'en' ? 'en-US' : currentLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  const analyzeSymptoms = async (userMessage: string): Promise<string> => {
    // Simple symptom analysis logic - in production, this would use ML models
    const symptoms = {
      fever: /fever|temperature|hot|chills/i,
      cough: /cough|coughing|throat/i,
      headache: /headache|head pain|migraine/i,
      stomach: /stomach|belly|nausea|vomit/i,
      breathing: /breath|chest|lung|wheez/i,
      pain: /pain|hurt|ache|sore/i
    };

    const severityKeywords = {
      mild: /mild|little|slight|minor/i,
      moderate: /moderate|medium|some/i,
      severe: /severe|intense|terrible|unbearable|emergency/i
    };

    let detectedSymptoms = [];
    let severity = 'mild';

    for (const [symptom, pattern] of Object.entries(symptoms)) {
      if (pattern.test(userMessage)) {
        detectedSymptoms.push(symptom);
      }
    }

    for (const [level, pattern] of Object.entries(severityKeywords)) {
      if (pattern.test(userMessage)) {
        severity = level;
        break;
      }
    }

    if (detectedSymptoms.length === 0) {
      return "I'd like to help you better. Can you describe your specific symptoms? For example, do you have fever, cough, headache, or any pain?";
    }

    let response = `I understand you're experiencing ${detectedSymptoms.join(', ')}. `;

    if (severity === 'severe' || detectedSymptoms.includes('breathing')) {
      response += "These symptoms seem serious. I recommend seeking immediate medical attention at the nearest hospital or calling emergency services.";
    } else if (severity === 'moderate') {
      response += "These symptoms warrant medical attention. I recommend visiting a healthcare provider within 24 hours.";
    } else {
      response += "These are common symptoms. Please tell me more: How long have you had these symptoms? Any other symptoms you've noticed?";
    }

    return response;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await analyzeSymptoms(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      speakMessage(response);

      // Check if we should generate a diagnosis report
      if (messages.length > 6) {
        setTimeout(() => {
          onDiagnosisComplete?.({
            symptoms: inputValue,
            assessment: response,
            timestamp: new Date()
          });
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-card rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-medical-blue to-medical-green text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h3 className="font-semibold">AI Health Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4" />
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code} className="text-foreground">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start gap-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-medical-green text-white'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <Card className={`p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </Card>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-medical-green text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <Card className="p-3 bg-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce delay-200"></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-muted/50 rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your symptoms..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={toggleListening}
            variant={isListening ? "emergency" : "outline"}
            size="icon"
            disabled={isProcessing}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={sendMessage} 
            variant="medical"
            size="icon"
            disabled={!inputValue.trim() || isProcessing}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};