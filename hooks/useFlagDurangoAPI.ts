// hooks/useFlagDurangoAPI.ts
import { useState, useEffect } from 'react';
import { TEAMS, MATCHES, Team, Match } from '@/constants/data';

export function useFlagDurangoAPI() {
  // El estado inicia directamente con los mocks
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [matches, setMatches] = useState<Match[]>(MATCHES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDatosReales = async () => {
      try {
        // Reemplaza por tu dominio de producción (ej. en Vercel) o localhost
        const API_URL = 'https://www.flagdurango.com.mx/api'; 
        
        // Petición de equipos con límite de 1500
        const resTeams = await fetch(`${API_URL}/teams?limit=1500`);
        if (resTeams.ok) {
          const dbTeams = await resTeams.json();
          // Aquí puedes mapear dbTeams a la estructura del Mock si es necesario
          setTeams(dbTeams); 
        }

        // Petición de partidos con límite de 1500
        const resMatches = await fetch(`${API_URL}/matches?limit=1500`);
        if (resMatches.ok) {
          const dbMatches = await resMatches.json();
          setMatches(dbMatches);
        }

      } catch (error) {
        // Si la conexión falla, la app usa los mocks silenciosamente.
        console.warn("Fallo al conectar con la API. Usando mocks estáticos locales.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatosReales();
  }, []);

  return { teams, matches, isLoading };
}