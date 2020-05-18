const Comment = require('./comment');
const Follower = require('./follower');
const Image = require('./image');
const ImageTag = require('./imageTag');
const Tag = require('./tag');
const User = require('./user');
const TagFollower = require('./tagFollower');

Image.hasMany(Comment, {
    foreignKey: 'imageId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Comment.belongsTo(Image, {
    foreignKey: 'imageId',
});

User.hasMany(Comment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author',
});

User.hasMany(Image, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Image.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author',
});

User.belongsToMany(User, {
    through: Follower,
    foreignKey: 'userId',
    as: 'followed',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.belongsToMany(User, {
    through: Follower,
    foreignKey: 'followerId',
    as: 'following',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Tag.belongsToMany(Image, {
    through: ImageTag,
    foreignKey: 'tagId',
    as: 'images',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Image.belongsToMany(Tag, {
    through: ImageTag,
    as: 'tags',
    foreignKey: 'imageId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Tag.belongsToMany(User, {
    through: TagFollower,
    foreignKey: 'tagId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.belongsToMany(Tag, {
    through: TagFollower,
    as: 'tags',
    foreignKey: 'userId',
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
    TagFollower,
};