export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <img 
          width="1200" 
          height="475" 
          alt="GHBanner" 
          src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6"
          className="max-w-full h-auto mb-8"
        />
        
        <h1 className="text-4xl font-bold mb-4">Built with AI Studio</h1>
        
        <p className="text-xl mb-8">The fastest path from prompt to production with Gemini.</p>
        
        <a 
          href="https://aistudio.google.com/apps"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start building
        </a>
      </div>
    </main>
  )
}
