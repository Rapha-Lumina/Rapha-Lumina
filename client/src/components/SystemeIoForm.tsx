import { useEffect, useRef } from "react";

interface SystemeIoFormProps {
  scriptSrc: string;
  scriptId: string;
  className?: string;
}

export function SystemeIoForm({ scriptSrc, scriptId, className = "" }: SystemeIoFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById(scriptId)) {
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptSrc;
    script.async = true;

    // Append to container or document body
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    } else {
      document.body.appendChild(script);
    }

    // Cleanup function
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [scriptSrc, scriptId]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      data-testid="systemeio-form-container"
    />
  );
}
