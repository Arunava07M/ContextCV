import { Link } from 'react-router-dom';
import ContextLogo from '../components/ContextLogo'; 

const Home = () => {
  return (
    <div className="h-screen w-screen bg-[#fafafa] text-slate-900 font-sans overflow-hidden flex flex-col p-6 cursor-default">
      
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2 cursor-default">
          <ContextLogo size={28} />
          <span className="text-xl font-bold tracking-tighter">ContextCV</span>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/login" className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Login</Link>
          <Link to="/signup" className="text-white bg-slate-900 px-5 py-2 rounded-full hover:bg-slate-700 transition-all cursor-pointer">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center gap-12 max-w-6xl mx-auto w-full">
        
        <div className="text-center">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            The resume, <span className="text-blue-600">optimized.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-8">
            Stop guessing what the ATS wants. Build a career vault, match it to the job, and compile perfect LaTeX PDFs that stand out.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 cursor-pointer">
              Build your profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Vector-first", desc: "We don't match keywords. We match concepts for engineering edges." },
            { title: "LaTeX Engine", desc: "PDF generation via code. Mathematically sound structures." },
            { title: "Privacy First", desc: "Data stays in your vault. Only access what you need." }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 mb-4 flex items-center justify-center font-bold text-slate-700">
                {idx + 1}
              </div>
              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center text-slate-400 text-xs py-4 cursor-default">
        © 2026 ContextCV. Built for developers.
      </footer>
    </div>
  );
};

export default Home;