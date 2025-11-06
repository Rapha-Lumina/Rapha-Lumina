import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageCircle, Send, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const faqData = [
    {
      question: "What is Rapha Lumina?",
      answer: "Rapha Lumina is an AI-powered spiritual wellness platform that provides personalized guidance through conversations with an advanced AI chatbot. We combine wisdom from Greek philosophy, Eastern practices, mystical teachings, and depth psychology to support your spiritual journey."
    },
    {
      question: "How does the AI chatbot work?",
      answer: "Our chatbot uses Claude AI technology, trained with spiritual wisdom from diverse traditions. It engages in Socratic dialogue, asking empowering questions rather than giving prescriptive answers. The AI adapts to your unique journey, offering insights tailored to your needs while maintaining a supportive, non-judgmental presence."
    },
    {
      question: "What's the difference between Free, Premium, and Transformation tiers?",
      answer: "Free Access provides 5 total chat sessions to explore the platform. Premium Wisdom ($20/month or R290) includes 10 monthly chats, voice interaction, and priority support, with a 7-day free trial before billing. The Transformation Package ($470 or R4970 one-time) offers unlimited chats, a 12-week guided program, weekly 1-on-1 coaching calls, and full Academy access with courses, meditations, and exclusive resources."
    },
    {
      question: "Can I upgrade or downgrade my subscription?",
      answer: "Yes! You can upgrade from Free to Premium or Premium to Transformation at any time. Your unused chat sessions will carry over. To change your subscription, visit the Shop page and select your desired tier. For downgrades or cancellations, contact our support team at support@raphalumina.com."
    },
    {
      question: "How does voice interaction work?",
      answer: "Premium and Transformation members can use voice features to speak their questions and hear AI responses read aloud. Simply click the microphone icon in the chat interface to start speaking. The AI will transcribe your voice, process your question, and respond with both text and optional audio playback."
    },
    {
      question: "What content is available in the Academy?",
      answer: "The Rapha Lumina Academy (available to Premium and Transformation members) includes guided courses on spiritual development, video lessons from expert teachers, interactive flashcards for key concepts, a meditation library with guided tracks, and curated background music for contemplative practice. Content is regularly updated with new teachings."
    },
    {
      question: "Is my conversation data private and secure?",
      answer: "Absolutely. Your conversations are encrypted and stored securely. We never share your personal data or chat history with third parties. Your spiritual journey is deeply personal, and we treat your privacy with the utmost respect. You can review our Privacy Policy for complete details."
    },
    {
      question: "What if I don't resonate with the AI's guidance?",
      answer: "The AI is designed to meet you where you are, but spiritual guidance is deeply personal. If a particular response doesn't resonate, you can simply continue the conversation in a different direction, ask clarifying questions, or restart with a new topic. The AI learns from context and adapts its approach. Remember, you're always in control of your journey."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day satisfaction guarantee for Premium subscriptions. If you're not finding value in the first week, contact us at support@raphalumina.com for a full refund. For the Transformation Package, we offer a 14-day guarantee. Refunds are processed within 5-7 business days."
    },
    {
      question: "How do I access the Academy after purchase?",
      answer: "After completing your purchase through our secure payment system, you'll automatically receive Academy access within a few minutes. Simply log back into Rapha Lumina and navigate to the Academy page. If you don't see access after 10 minutes, please contact support@raphalumina.com with your order confirmation."
    },
    {
      question: "Can I chat with Rapha Lumina in multiple languages?",
      answer: "Currently, Rapha Lumina primarily communicates in English. However, the AI can understand and respond in several major languages including Spanish, French, German, Portuguese, and Mandarin Chinese. Language support is continuously expanding based on user needs."
    },
    {
      question: "What makes Rapha Lumina different from other spiritual apps?",
      answer: "Unlike meditation timers or pre-recorded content apps, Rapha Lumina offers real-time, personalized spiritual dialogue powered by advanced AI. We combine the depth of philosophical inquiry with the accessibility of modern technology. Our approach honors multiple wisdom traditions while remaining non-dogmatic, meeting you exactly where you are on your unique path."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll respond within 24-48 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl sm:text-6xl mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about your spiritual journey? Want to learn more about our offerings? 
              We're here to support you.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16" id="contact-form">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-3xl mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-2 block">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    data-testid="input-contact-subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your thoughts or questions..."
                    rows={6}
                    required
                    data-testid="input-contact-message"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gap-2"
                  disabled={isSubmitting}
                  data-testid="button-submit-contact"
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info & Quick Actions */}
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl mb-6">Other Ways to Connect</h2>
                
                <div className="space-y-4">
                  <Card className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">Chat with Rapha Lumina</CardTitle>
                          <CardDescription>
                            Start a conversation with our AI guide for immediate spiritual insights and guidance.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/chat" data-testid="link-start-chat">
                          Start a Conversation
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">Email Support</CardTitle>
                          <CardDescription>
                            For premium members, direct email support is available with 24-48 hour response time.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        support@raphalumina.com
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Response Time</CardTitle>
                  <CardDescription>
                    We typically respond to all inquiries within 24-48 hours. Premium members receive priority support.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-b from-background to-primary/5 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-4xl sm:text-5xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about Rapha Lumina, our AI chatbot, subscriptions, and spiritual guidance.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border rounded-lg px-6 hover-elevate"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger 
                    className="text-left hover:no-underline py-5"
                    data-testid={`faq-question-${index}`}
                  >
                    <span className="font-medium text-base pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent 
                    className="text-muted-foreground pb-5 leading-relaxed"
                    data-testid={`faq-answer-${index}`}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center">
              <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Still have questions?</CardTitle>
                  <CardDescription className="text-base">
                    Chat with Rapha Lumina for personalized guidance or reach out to our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button variant="default" size="lg" asChild>
                      <a href="/chat" data-testid="link-faq-chat">
                        Chat with Rapha Lumina
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="#contact-form" data-testid="link-faq-contact">
                        Contact Support
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Rapha Lumina. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
