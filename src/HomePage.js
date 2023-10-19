import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from './GlobalStateContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

const HomePage = () => {
  const { globalState: sprintSurveyData } = useGlobalState('sprintSurvey');
  const { globalState } = useGlobalState('sprintSurveyData');
  const { categoryAverages, totalAverage } = globalState;
  // Función para calcular el promedio de las respuestas del sprint
  const calculateAverage = (responses) => {
    if (responses.length === 0) return 0;
    const sum = responses.reduce((acc, response) => acc + response, 0);
    return sum / responses.length;
  };

  // Agrupa los datos por fecha y calcula el promedio
  const groupedData = {};
  sprintSurveyData.forEach((response) => {
    const date = response.date;
    const value = parseFloat(calculateAverage(response.values).toFixed(2));
    if (groupedData[date]) {
      groupedData[date].push(value);
    } else {
      groupedData[date] = [value];
    }
  });

  const chartDataSprintSurvey = Object.keys(groupedData).map((date) => ({
    date,
    value: (
      groupedData[date].reduce((acc, value) => acc + value, 0) / groupedData[date].length
    ).toFixed(2),
  }));

  // Función para obtener el mensaje de calificación del Sprint
  const getSprintRatingMessage = (value) => {
    if (value >= 4) {
      return 'Fue un Sprint Eficiente';
    } else if (value >= 3) {
      return 'Fue un Sprint Decente';
    } else {
      return 'Fue un Sprint Deficiente';
    }
  };



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
    const [savedRespuestas, setSavedRespuestas] = useState([]);
    const [savedAverage, setSavedAverage] = useState(null);
  
    const handleChange = (e, category) => {
      const value = parseInt(e.target.value);
      setSurveyData({
        ...surveyData,
        [category]: value,
      });
    };
  
    const calculateAverage2 = (data) => {
      const values = Object.values(data);
      if (values.length === 0) return 0;
      const sum = values.reduce((acc, value) => acc + value, 0);
      return (sum / (values.length * 5)).toFixed(2); // Asumiendo que el rango de calificación es de 1 a 5
    };
  
    const saveRespuestas = () => {
      const respuestas = { ...surveyData };
      setSavedRespuestas([...savedRespuestas, respuestas]);
      setSurveyData(initialSurveyData);
    };
  
    const generateChart2 = () => {
      setShowChart(true);
      const average = calculateAverage2(surveyData);
      if (average !== null) {
        setSavedAverage(average);
      }
    };
  
    const generatePointsChart = () => {
      setShowPointsChart(true);
    };
  
    // Esta función calcula el promedio de cada categoría en base a las respuestas guardadas.
    const calculateCategoryAverages = () => {
      const categoryAverages = {};
      for (const category in initialSurveyData) {
        if (initialSurveyData.hasOwnProperty(category)) {
          const totalSum = savedRespuestas.reduce((acc, respuestas) => {
            if (respuestas && respuestas[category] !== undefined && respuestas[category] !== null) {
              return acc + respuestas[category];
            } else {
              return acc; // Evita agregar respuestas no definidas o nulas
            }
          }, 0);
          const average = (totalSum / savedRespuestas.length).toFixed(2);
          categoryAverages[category] = average;
        }
      }
      return categoryAverages;
    };
  
    // Calcula el promedio total de todas las respuestas guardadas
    const calculateTotalAverage = () => {
      const totalResponses = savedRespuestas.length;
      const totalSum = savedRespuestas.reduce((acc, respuestas) => {
        const values = Object.values(respuestas);
        return acc + values.reduce((valAcc, value) => valAcc + value, 0);
      }, 0);
      return (totalSum / (totalResponses * 6)).toFixed(2); // Asumiendo que hay 6 categorías
    };
  
    const totalAverageData = [
      {
        name: 'Promedio Total de Puntos',
        promedio: parseFloat(calculateTotalAverage()),
      },
    ];
  
    return (
      <div className="container">
      <header className="navbar">
        <a className="navbar-brand">Chocobito</a>
        <label htmlFor="menu-toggle" className="navbar-toggler">
          <span className="navbar-toggler-icon"></span>
        </label>
        <nav className="navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <label htmlFor="evaluacionDropdown" className="nav-link dropdown-label">
                EVALUACION
              </label>
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <Link to="/Satisfaccion">Satisfacción</Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/Resumen">Resumen</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      <div className="content">
        {/* Aplica la clase "centered-container" para centrar el contenido */}
        <h2>Evaluación de estado de Salud del Equipo</h2>
        <div className="centered-container">
          {chartDataSprintSurvey.length > 0 ? (
            <>
              <BarChart width={600} height={400} data={chartDataSprintSurvey}>
                <XAxis dataKey="date" type="category" angle={0} textAnchor="middle" />
                <YAxis domain={[0, 5]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="rgba(75, 192, 192, 0.6}" />
              </BarChart>
            </>
          ) : (
            <p>Aun no hay evaluación del Sprint</p>
          )}
        </div>
        {chartDataSprintSurvey.length > 0 && (
          <div>
            <p>Mensajes de calificación por fecha:</p>
            <ul>
              {chartDataSprintSurvey.map((data) => (
                <li key={data.date}>
                  {data.date}: {getSprintRatingMessage(parseFloat(data.value))}
                </li>
              ))}
            </ul>
          </div>
        )}
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
            <button onClick={saveRespuestas}>Guardar Respuestas</button>
            <button onClick={generateChart2}>Generar Gráfico de Promedio</button>
            <button onClick={generatePointsChart}>Generar Gráfico de Puntos</button>
          </div>
          {savedRespuestas.length > 0 && (
            <div>
              <h3>Respuestas guardadas:</h3>
              <ul>
                {savedRespuestas.map((respuestas, index) => (
                  <li key={index}>Respuesta {index + 1}: {JSON.stringify(respuestas)}</li>
                ))}
              </ul>
            </div>
          )}
          {showChart && (
            <div style={{ width: '80%', margin: '0 auto' }}>
              <BarChart width={600} height={400} data={Object.keys(initialSurveyData).map((category) => ({
                category,
                promedio: parseFloat(calculateCategoryAverages()[category]),
              }))}>
                <XAxis dataKey="category" />
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
                <Bar dataKey="promedio" fill="rgba(75, 192, 192, 0.6}" />
              </BarChart>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default HomePage;