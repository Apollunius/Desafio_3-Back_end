const { totalVitorias } = require('../repositories/tabela');
const Tabela = require('../repositories/tabela');
const response = require('../utils/response');

let classificada = [];

const tabelaCompleta = async (ctx) => {
	const result = await Tabela.total();
	if (result.length > 3) {
		return response(ctx, 200, result);
	}
	return ctx, 404, { mensagem: 'Conteúdo não encontrado' };
};
const tabelaPorRodada = async (ctx) => {
	const { id = null } = ctx.params;
	if (id) {
		const result = await Tabela.rodada(id);
		if (result.length > 3) {
			return response(ctx, 200, result);
		}
		return response(ctx, 404, { mensagem: 'Rodada não encontrada' });
	}
	return response(ctx, 400, { mensagem: 'Mal formatado' });
};
const attTabela = async (ctx) => {
	const {
		id = null,
		golsCasa = null,
		golsVisitante = null,
	} = ctx.request.body;
	if (!id || !golsCasa || !golsVisitante) {
		return response(ctx, 400, { mensagem: 'Mal formatado' });
	}
	const result = await Tabela.atualizarJogo(id, golsCasa, golsVisitante);
	return response(ctx, 200, result);
};

const attPontos = (time, pontos, gols, sofridos, state) => {
	let encontrado = false;
	classificada.forEach((timeTabela) => {
		if (!encontrado && timeTabela.jogos !== 38) {
			if (timeTabela.time === time) {
				timeTabela.jogos++;
				timeTabela.pontos += pontos;
				timeTabela.golsFeitos += gols;
				timeTabela.golsSofridos += sofridos;
				if (state === 'e') {
					timeTabela.empates++;
				} else if (state === 'v') {
					timeTabela.vitorias++;
				} else {
					timeTabela.derrotas++;
				}
				encontrado = true;
			}
		}
	});

	if (!encontrado) {
		classificada.push({
			time: time,
			pontos: pontos,
			jogos: 1,
			vitorias: state === 'v' ? 1 : 0 ,
			derrotas: state === 'd' ? 1 : 0,
			empates: state === 'e' ? 1 : 0,
			golsFeitos: gols,
			golsSofridos: sofridos,
		});
	}
	
};

const tabelaClassificada = async (ctx) => {
	classificada = [];

	const jogos = await Tabela.total();

	jogos.forEach((jogo) => {
		if (jogo.gols_casa === jogo.gols_visitante) {
			attPontos(
				jogo.time_casa,
				1,
				parseInt(jogo.gols_casa),
				parseInt(jogo.gols_visitante),
				'e'
			);
			attPontos(
				jogo.time_visitante,
				1,
				parseInt(jogo.gols_visitante),
				parseInt(jogo.gols_casa),
				'e'
			);
		} else if (jogo.gols_casa > jogo.gols_visitante) {
			attPontos(
				jogo.time_casa,
				3,
				parseInt(jogo.gols_casa),
				parseInt(jogo.gols_visitante),
				'v'
			);
			attPontos(
				jogo.time_visitante,
				0,
				parseInt(jogo.gols_visitante),
				parseInt(jogo.gols_casa),
				'd'
			);
		} else {
			attPontos(
				jogo.time_visitante,
				3,
				parseInt(jogo.gols_visitante),
				parseInt(jogo.gols_casa),
				'v'
			);
			attPontos(
				jogo.time_casa,
				0,
				parseInt(jogo.gols_casa),
				parseInt(jogo.gols_visitante),
				'd'
			);
		}
	});

const classificadaOrdenada = (a, b) => 
	a.pontos > b.pontos
		? -1
		: a.pontos < b.pontos
		? 1
		: a.vitorias > b.vitorias
		? -1
		: a.vitorias < b.vitorias
		? 1
		: a.golsFeitos - a.golsSofridos > b.golsFeitos - b.golsSofridos
		? -1
		: a.golsFeitos - a.golsSofridos < b.golsFeitos - b.golsSofridos
		? 1
		: a.localeCompare(b);

classificada.sort(classificadaOrdenada);

	return response(ctx, 200, classificada);
};

module.exports = {
	tabelaClassificada,
	tabelaCompleta,
	tabelaPorRodada,
	attTabela,
};
