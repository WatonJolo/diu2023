import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useGlobalState } from './GlobalStateContext'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';


const HappinessSurvey = () => {
  const { globalState, setGlobalState } = useGlobalState();

  const initialSurveyData = {
    gestion: 1,
    software: 1,
    cultura: 1,
    valor: 1,
    entregas: 1,
    autodeterminacion: 1,
  };

  const [surveyData, setSurveyData] = useState(initialSurveyData);
  const [showChart, setShowChart] = useState(false);
  const [showPointsChart, setShowPointsChart] = useState(false);
  const [savedResponses, setSavedResponses] = useState([]);
  const [savedAverage, setSavedAverage] = useState(null);

  const handleChange = (e, category) => {
    const value = parseInt(e.target.value);
    setSurveyData({
      ...surveyData,
      [category]: value,
    });
  };

  const calculateAverage = (data) => {
    const values = Object.values(data);
    const sum = values.reduce((acc, value) => acc + value, 0);
    return (sum / values.length).toFixed(2);
  };

  const calculateCategoryPointsAverage = (category) => {
    const totalResponses = savedResponses.length;
    const categorySum = savedResponses.reduce((acc, response) => response[category], 0);
    return (categorySum / totalResponses).toFixed(2);
  };

  const calculateOverallPointsAverage = () => {
    const totalResponses = savedResponses.length;
    const pointsSum = savedResponses.reduce((acc, response) => {
      const values = Object.values(response);
      return acc + values.reduce((valAcc, value) => valAcc + value, 0);
    }, 0);
    return (pointsSum / (totalResponses * 6)).toFixed(2);
  };

  const saveResponses = () => {
    const responses = { ...surveyData };
    setSavedResponses([...savedResponses, responses]);
    setSurveyData(initialSurveyData);
  };

  const generateChart = () => {
    setShowChart(true);
    const average = calculateAverage(surveyData);
    setSavedAverage(average);

    // Actualiza el estado global con el promedio de todas las respuestas
    setGlobalState({ ...globalState, promedioTotal: average });
  };

  const generatePointsChart = () => {
    setShowPointsChart(true);
    const categoryAverages = calculateCategoryAverages();

    // Actualiza el estado global con el promedio de respuesta de cada categoría
    setGlobalState({ ...globalState, categoryAverages });

    // Opcional: También puedes actualizar el promedio total si lo necesitas
    setGlobalState({ ...globalState, promedioTotal: calculateTotalAverage() });
  };

  const calculateTotalAverage = () => {
    const totalResponses = savedResponses.length;
    const totalSum = savedResponses.reduce((acc, response) => {
      const values = Object.values(response);
      return acc + values.reduce((valAcc, value) => valAcc + value, 0);
    }, 0);
    return (totalSum / (totalResponses * 6)).toFixed(2);
  };

  const totalAverageData = [
    {
      name: 'Promedio Total de Puntos',
      promedio: parseFloat(calculateTotalAverage()),
    },
  ];

  const calculateCategoryAverages = () => {
    const categoryAverages = {};

    // Calcular promedio para cada categoría
    for (const key in initialSurveyData) {
      if (initialSurveyData.hasOwnProperty(key)) {
        const totalSum = savedResponses.reduce((acc, response) => {
          return acc + response[key];
        }, 0);
        const average = (totalSum / savedResponses.length).toFixed(2);
        categoryAverages[key] = average;
      }
    }

    return categoryAverages;
  };
  const categoryAverages = calculateCategoryAverages();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h2>Índice de Felicidad del Equipo Ágil</h2>
        <form>
          <div>
            <label>
              Gestion: Entendemos nuestra estrategia y responsabilidades.
              <select onChange={(e) => handleChange(e, 'gestion')} value={surveyData.gestion}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Software: Nuestro software es mantenible, seguro y confiable.
              <select onChange={(e) => handleChange(e, 'software')} value={surveyData.software}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Cultura: Trabajamos eficazmente entre nosotros.
              <select onChange={(e) => handleChange(e, 'cultura')} value={surveyData.cultura}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Valor: Usamos comentarios para mejorar.
              <select onChange={(e) => handleChange(e, 'valor')} value={surveyData.valor}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Entregas: Entregamos a tiempo, damos mantención y soporte.
              <select onChange={(e) => handleChange(e, 'entregas')} value={surveyData.entregas}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Autodeterminación: Solucionamos los problemas propios y de los clientes.
              <select onChange={(e) => handleChange(e, 'autodeterminacion')} value={surveyData.autodeterminacion}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
        <div>
          <button onClick={saveResponses}>Guardar Respuestas</button>
          <button onClick={generateChart}>Generar Gráfico de Promedio</button>
          <button onClick={generatePointsChart}>Generar Gráfico de Puntos</button>
          <Link to="/">
          <button>Ir a la página de inicio</button>
        </Link>
        </div>
        {savedResponses.length > 0 && (
          <div>
            <h3>Respuestas guardadas:</h3>
            <ul>
              {savedResponses.map((response, index) => (
                <li key={index}>Respuesta {index + 1}: {JSON.stringify(response)}</li>
              ))}
            </ul>
          </div>
        )}
        <p>Promedio de Felicidad: {savedAverage || calculateAverage(surveyData)}</p>
        {showChart && (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <BarChart width={600} height={400} data={Object.entries(categoryAverages).map(([name, promedio]) => ({
            name,
            promedio: parseFloat(promedio),
          }))}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 5]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="promedio" fill="rgba(75, 192, 192, 0.6)" />
          </BarChart>
        </div>
)}

        {showPointsChart && (
          <div style={{ width: '80%', margin: '0 auto' }}>
            <BarChart width={600} height={400} data={totalAverageData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="rgba(75, 192, 192, 0.6)" />
            </BarChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default HappinessSurvey;

