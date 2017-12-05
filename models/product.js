var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    categroy: {
        type: Schema.Types.ObjectId,
        ref: 'Categroy' ////关联Category表的_id
    },
    name: String,
    price: Number,
    image: String
});

ProductSchema.plugin(mongoosastic,{
    hosts: [
        'localhost:9200'
    ]
});

module.exports = mongoose.model('Product', ProductSchema);