// =========================================
// REPLACE lines 72-86 in client/src/pages/contact.tsx
// Replace this entire handleSubmit function
// =========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. We'll respond within 24-48 hours.",
        });
        
        // Clear form on success
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

// =========================================
// OLD CODE (lines 72-86) - DELETE THIS:
// =========================================
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     
//     // Simulate form submission
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     
//     toast({
//       title: "Message sent!",
//       description: "Thank you for reaching out. We'll respond within 24-48 hours.",
//     });
//     
//     setFormData({ name: "", email: "", subject: "", message: "" });
//     setIsSubmitting(false);
//   };
