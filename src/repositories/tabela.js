const { now, result, forEach } = require('lodash');
const database = require('../utils/database');

const total = async () => {
	const query = 'SELECT * FROM jogos';
	const result = await database.query(query);

	return result.rows;
};
const rodada = async (numRodada) => {
	const query = `SELECT * FROM jogos WHERE rodada = ${numRodada}`;
	const result = await database.query(query);

	return result.rows;
};
const atualizarJogo = async (id, gol_casa, gol_visita) => {
	const query = `UPDATE jogos SET gols_casa = ${gol_casa}, gols_visitante = ${gol_visita} WHERE id = ${id} RETURNING *`;
	const result = await database.query(query);

	return result.rows;
};

const golsFeitos = async (time) => {
	const query1 = `SELECT SUM(gols_casa) FROM jogos WHERE time_casa = '${time}'`;
	const query2 = `SELECT SUM(gols_visitante) FROM jogos WHERE time_visitante = '${time}'`;
	const result1 = await database.query(query1);
	const result2 = await database.query(query2);
	const soma = parseInt(result1.rows[0].sum) + parseInt(result2.rows[0].sum);

	return soma;
};

const golsSofridos = async (time) => {
	const query1 = `SELECT SUM(gols_visitante) FROM jogos WHERE time_casa = '${time}'`;
	const query2 = `SELECT SUM(gols_casa) FROM jogos WHERE time_visitante = '${time}'`;
	const result1 = await database.query(query1);
	const result2 = await database.query(query2);
	const soma = parseInt(result1.rows[0].sum) + parseInt(result2.rows[0].sum);

	return soma;
};
const totalRodadas = async (time) => {
	const query1 = `SELECT COUNT(rodada) FROM jogos WHERE time_casa = '${time}'`;
	const query2 = `SELECT COUNT(rodada) FROM jogos WHERE time_visitante = '${time}'`;
	const result1 = await database.query(query1);
	const result2 = await database.query(query2);
	const total =
		parseInt(result1.rows[0].count) + parseInt(result2.rows[0].count);

	return total;
};
const totalVitorias = async (time) => {
	const query = `SELECT count(id) from jogos WHERE (time_casa = '${time}' and gols_casa > gols_visitante) or (time_visitante = '${time}' and gols_visitante > gols_casa)`;
	const result = await database.query(query);

	return result.rows;
};
const totalDerrotas = async (time) => {
	const query = `SELECT count(id) from jogos WHERE (time_casa = '${time}' and gols_casa < gols_visitante) or (time_visitante = '${time}' and gols_visitante < gols_casa)`;
	const result = await database.query(query);

	return result.rows;
};

const totalEmpates = async (time) => {
	const query = `SELECT count(id) from jogos WHERE (time_casa = '${time}' and gols_casa = gols_visitante) or (time_visitante = '${time}' and gols_visitante = gols_casa)`;
	const result = await database.query(query);

	return result.rows;
};


module.exports = {
	total,
	rodada,
	atualizarJogo,
	totalVitorias,
	totalDerrotas,
	totalEmpates,
	golsFeitos,
};
