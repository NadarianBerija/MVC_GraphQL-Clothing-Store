const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLFloat, GraphQLNonNull } = require('graphql');

const Cloth = require('../models/cloth');

const ClothType = new GraphQLObjectType({
    name: 'Cloth',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        category: { type: GraphQLString},
        image: { type: GraphQLString }
    })
});

// Это точки входа для получения данных
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        cloth: {
            type: ClothType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Cloth.findByPk(args.id);
            }
        },
        clothes: {
            type: new GraphQLList(ClothType),
            resolve(parent, args) {
                return Cloth.findAll();
            }
        }
    }
});

// Это точки входа для изменения данных (создание, обновление, удаление)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCloth: {
            type: ClothType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                image: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const cloth = new Cloth({
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    category: args.category,
                    image: args.image
                });
                return cloth.save();
            }
        },
        updateCloth: {
            type: ClothType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat },
                category: { type: GraphQLString },
                image: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const cloth = await Cloth.findByPk(args.id);
                if (!cloth) {
                    throw new Error('Одежда не найдена');
                }
                // Обнавляем поля, если они были переданы в аргументах
                cloth.name = args.name || cloth.name;
                cloth.description = args.description || cloth.description;
                cloth.price = args.price || cloth.price;
                cloth.category = args.category || cloth.category;
                cloth.image = args.image || cloth.image;
                return cloth.save();
            }
        },
        // Мутация для удаления игрушки
        deleteCloth: {
            type: ClothType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                const cloth = await Cloth.findByPk(args.id);
                if (!cloth) {
                    throw new Error('Одежда не найдена');
                }
                await cloth.destroy();
                return cloth;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});