const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Nedb = require('nedb');
const Package = require('./package.json');
const server = new Hapi.Server();

const Contacts = new Nedb({
    filename: '.contacts.json',
    autoload: true
});

const Swagger = {
    register: HapiSwagger,
    options: {
        apiVersion: Package.version
    }
};

server.connection({
    host: 'localhost',
    port: 3001,
    routes: {
        cors: true
    }
});

server.register([
    Inert,
    Vision,
    Swagger
], (err) => {
    err && console.error('Failed to load a module:', err);

    server.start(() => {
        server.route({
            method: 'GET',
            path: '/contacts',
            handler: (request, reply) => Contacts.find({}, (err, docs) => reply(docs)),
            config: {
                tags: ['api'],
                description: 'Lista contatos',
                response: {
                    schema: Joi.array().items(Joi.object({
                        _id: Joi.string().required(),
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        message: Joi.string().required(),
                        metadata: Joi.object()
                    }))
                }
            }
        });

        server.route({
            method: 'POST',
            path: '/contacts',
            handler: (request, reply) => Contacts.insert({
                name: request.payload.name,
                email: request.payload.email,
                message: request.payload.message,
                metadata: request.payload.metadata
            }, (err, newDoc) => reply(newDoc).code(201)),
            config: {
                tags: ['api'],
                description: 'Adiciona contato',
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        message: Joi.string().required(),
                        metadata: Joi.object()
                    }
                },
                response: {
                    schema: {
                        _id: Joi.string().required(),
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        message: Joi.string().required(),
                        metadata: Joi.object()
                    }
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/contacts/{_id}',
            handler: (request, reply) => Contacts.findOne({_id: request.params._id}, (err, doc) => reply(doc)),
            config: {
                tags: ['api'],
                description: 'Retonar contato',
                validate: {
                    params: {
                        _id: Joi.string().required()
                    }
                },
                response: {
                    schema: {
                        _id: Joi.string().required(),
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        message: Joi.string().required(),
                        metadata: Joi.object()
                    }
                }
            }
        });

        server.route({
            method: 'PUT',
            path: '/contacts/{_id}',
            handler: (request, reply) => Contacts.update({_id: request.params._id}, request.payload, {}, (err) => reply().code(204)),
            config: {
                tags: ['api'],
                description: 'Substitui contato',
                validate: {
                    params: {
                        _id: Joi.string().required()
                    },
                    payload: {
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        message: Joi.string().required(),
                        metadata: Joi.object()
                    }
                }
            }
        });

        server.route({
            method: 'PATCH',
            path: '/contacts/{_id}',
            handler: (request, reply) => Contacts.update({_id: request.params._id}, {$set: request.payload}, {}, (err) => reply().code(204)),
            config: {
                tags: ['api'],
                description: 'Atualiza contato',
                validate: {
                    params: {
                        _id: Joi.string().required()
                    },
                    payload: {
                        name: Joi.string(),
                        email: Joi.string().email(),
                        message: Joi.string(),
                        metadata: Joi.object()
                    }
                }
            }
        });

        server.route({
            method: 'DELETE',
            path: '/contacts/{_id}',
            handler: (request, reply) => Contacts.remove({_id: request.params._id}, {}, (err) => reply().code(204)),
            config: {
                tags: ['api'],
                description: 'Remove contato',
                validate: {
                    params: {
                        _id: Joi.string().required()
                    }
                }
            }
        });

        console.log('Server running at:', server.info.uri);
    });
});
