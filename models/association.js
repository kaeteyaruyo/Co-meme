const Comment = require('./comment');
const Follower = require('./follower');
const Image = require('./image');
const ImageTag = require('./imageTag');
const Tag = require('./tag');
const User = require('./user');

User.hasMany(Comment, {
    foreignKey: 'author',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.hasMany(Image, {
    foreignKey: 'author',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.belongsToMany(User, {
    through: Follower,
    as: 'followed',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.belongsToMany(User, {
    through: Follower,
    as: 'following',
    foreignKey: 'followerId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Tag.belongsToMany(Image, {
    through: ImageTag,
    foreignKey: 'tagId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Image.belongsToMany(Tag, {
    through: ImageTag,
    foreignKey: 'imageId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = {
    Comment,
    Follower,
    Image,
    ImageTag,
    Tag,
    User,
};