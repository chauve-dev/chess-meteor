


function chess960Pos() {
    let pieces = ["r", "n", "b", "q", "k", "b", "n", "r"]
    let shuffled = pieces
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)
    return shuffled
}
function organize(ligne, couleur, chess,config){
    let lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    for (var i in lettres){
        chess.put({type: config[i], color: couleur}, lettres[i]+ligne)
    }
}
function chess960(chess){
    let config = chess960Pos();
    organize("1", "w", chess,config);
    organize("8", "b", chess,config);
}
module.exports = {chess960};