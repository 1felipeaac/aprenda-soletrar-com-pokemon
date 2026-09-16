import { useState, useEffect } from 'react';
import { Heart, MapPin, ExternalLink, Sparkles } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  location: string;
  public_repos: number;
}

const FALLBACK_USER: GitHubUser = {
  login: '1felipeaac',
  name: 'Felipe Coelho',
  avatar_url: 'https://avatars.githubusercontent.com/u/110578112?v=4',
  html_url: 'https://github.com/1felipeaac',
  bio: 'Dev Pleno Fullstack | JS, TS, Node, React, Java, Spring Boot',
  location: 'Timon-MA',
  public_repos: 58,
};

export const Footer: React.FC = () => {
  const [user, setUser] = useState<GitHubUser>(FALLBACK_USER);

  useEffect(() => {
    let isMounted = true;
    fetch('https://api.github.com/users/1felipeaac')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setUser({
          login: data.login || FALLBACK_USER.login,
          name: data.name ? data.name.trim() : FALLBACK_USER.name,
          avatar_url: data.avatar_url || FALLBACK_USER.avatar_url,
          html_url: data.html_url || FALLBACK_USER.html_url,
          bio: data.bio || FALLBACK_USER.bio,
          location: data.location || FALLBACK_USER.location,
          public_repos: data.public_repos ?? FALLBACK_USER.public_repos,
        });
      })
      .catch(() => {
        // Mantém os dados locais de fallback silenciosamente
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="w-full bg-white/90 backdrop-blur-md border-t-4 border-amber-200 mt-auto py-8 px-4 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Painel Principal do Rodapé */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 p-5 rounded-3xl border-2 border-amber-200/80 shadow-sm">
          
          {/* Card do Autor (GitHub API) */}
          <div className="flex items-center gap-4 text-left">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group block shrink-0"
              title="Visitar perfil no GitHub"
            >
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow-sm group-hover:scale-105 group-hover:ring-4 group-hover:ring-amber-200 transition-all"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-sm">
                <GithubIcon className="w-3.5 h-3.5" />
              </span>
            </a>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-black text-slate-800 capitalize">
                  {user.name}
                </h4>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  @{user.login}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-0.5 flex-wrap">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {user.location}
                  </span>
                )}
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[11px] font-extrabold">
                  {user.public_repos} repositórios
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-1 max-w-sm">
                {user.bio}
              </p>
            </div>
          </div>

          {/* Mensagem Afetiva e Pedagógica */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1.5">
            <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 font-black text-xs px-3 py-1.5 rounded-full border border-rose-200 shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Feito com carinho de pai para filha</span>
            </div>
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Alfabetização Fônica Divertida com Pokémon
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Aprender brincando, sem medo de errar!
            </p>
          </div>
        </div>

        {/* Linha de Isenção Legal & Fair Use */}
        <div className="text-center text-[11px] text-slate-400 font-medium space-y-1 border-t border-amber-100 pt-4">
          <p>
            Pokémon e nomes de personagens são marcas registradas de © Nintendo, Creatures Inc. e GAME FREAK Inc.
          </p>
          <p>
            Projeto independente de código aberto desenvolvido para fins exclusivamente educacionais, familiares e sem fins lucrativos (Fair Use).
          </p>
        </div>
      </div>
    </footer>
  );
};
