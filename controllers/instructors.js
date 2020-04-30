const fs = require('fs');
const Intl = require('intl');
const data = require('../data.json');
const { age, date } = require('../utils');

// index
exports.index = function(req, res) {
	return res.render('instructors/index', {instructors : data.instructors });
}

// create
exports.create = function(req, res) {
	return res.render('instructors/create');
};

//cadastro
exports.post = function(req, res) {
	const keys = Object.keys(req.body);

	for (const key of keys) {
		if (req.body[key] == '') {
			return res.send('Falta preenchimento de algum campo.');
		}
	}
		
	let { avatar_url, name, birth, gender, services } = req.body;

	const created_at = Date.now();
	const id = Number(data.instructors.length + 1);
	birth = Date.parse(birth);//tranforma o campo de data de nascimento no mesmo formato da data de inserção

	data.instructors.push({
		id, 
		avatar_url,
		name,
		birth,
		gender,
		services,
		created_at
	});

	fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
		if (err) {
			return res.send('Erro ao escrever no arquivo');
		}

		return res.redirect('/instructors');
	});
};

//show
exports.show = function(req, res) {
	const { id } = req.params;
	const foundInstructor = data.instructors.find(function(instructor){
		return instructor.id == id;
	});

	if (!foundInstructor) {
		return res.send('Instrutor não encontrado!')
	}

	const instructor = {
		...foundInstructor,
		age: age(foundInstructor.birth),
		services: foundInstructor.services.split(','),
		created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),		
	}

	return res.render('instructors/show', { instructor: instructor });
};

// edit (Carrega os dados da página para serem editados)
exports.edit = function(req, res) {
	const { id } = req.params;
	const foundInstructor = data.instructors.find(function(instructor){
		return instructor.id == id;
	});

	if (!foundInstructor) {
		return res.send('Instrutor não encontrado!')
	}

	const instructor = {
		...foundInstructor,
		birth: date(foundInstructor.birth).iso,
	}
	
	return res.render('instructors/edit', { instructor : instructor});
};

// put (Envia os dados alterados para o backend)
exports.put = function(req, res) {
	const { id } = req.body;
	let index = 0;
	const foundInstructor = data.instructors.find(function(instructor, foundIndex){
		if (id == instructor.id) {
			index = foundIndex;
			return true;
		}
	});

	if (!foundInstructor) {
		return res.send('Instrutor não encontrado!')
	}

	const instructor = {
		...foundInstructor,
		...req.body,
		birth: Date.parse(req.body.birth),
		id: Number(req.body.id)
	};

	data.instructors[index] = instructor;

	fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
		if (err) {
			return res.send('Erro ao escrever no arquivo');
		}

		return res.redirect(`/instructors/${id}`);
	});
};

// delete
exports.delete = function(req, res) {
	const { id } = req.body;
	const filteredInstructors = data.instructors.filter(function(instructor) {
		return instructor.id != id;
	});

	data.instructors = filteredInstructors;

	fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
		if (err) {
			return res.send('Erro ao escrever no arquivo');
		}

		return res.redirect('/instructors');
	});
};