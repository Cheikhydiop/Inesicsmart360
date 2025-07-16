export class ValidationError extends Error {
    public details: string[];
  
    constructor(messages: string[] | string) {
      // Joindre les messages si c'est un tableau, sinon laisser tel quel
      const message = Array.isArray(messages) ? messages.join(', ') : messages;
      super(message);
      this.name = 'ValidationError';
  
      // Stocker tous les messages dans un tableau pour usage ultérieur
      this.details = Array.isArray(messages) ? messages : [messages];
    }
  }
  
  
  export class DatabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DatabaseError';
    }
  }
  
  