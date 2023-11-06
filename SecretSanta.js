var SecretSanta = function () {
    this.names = [];
};


SecretSanta.prototype.add = function ( name ) {

    if ( this.names.indexOf( name ) !== -1 )
        throw new Error( 'Cannot redefine ' + name );

    this.names.push( name );

    var subapi = { };

    return subapi;

};

SecretSanta.prototype.generate = function () {

    var pairings = Object.create( null );
    var candidatePairings = Object.create( null );
    var timesChosen = Object.create( null );

    

    // For each person, a list of possible candidates is generated (name => list(names))
    // We want to select 2 names per gifter, so let's add each name twice
    // And we initialize pairings as a dictionary of lists
    // we also initialize timesChosen to be 0 for each name
    this.names.forEach( function ( name ) {
        pairings[name] = [];
        timesChosen[name] = 0;

        var candidates = _.difference( this.names, [ name ] );
        // candidates = _.concat(candidates, candidates);

        candidatePairings[ name ] = candidates;
    }, this );

    // Finds the next gifter by looking at the number of potential targets there are, and taking the minimum
    var findNextGifter = function () {

        var names = Object.keys( candidatePairings );

        var minCandidateCount = _.min( names.map( function ( name ) { return candidatePairings[ name ].length; } ) );
        var potentialGifters = names.filter( function ( name ) { return candidatePairings[ name ].length === minCandidateCount; } );

        return _.sample( potentialGifters ); // Random selection

    };

    // Create the matches while there are possible pairings in candidatePairings
    while ( Object.keys( candidatePairings ).length > 0 ) {

        var name = findNextGifter();

        if ( candidatePairings[ name ].length === 0 )
            return this.generate(); // Lazy, if it doesn't work out, just try again

        var pairing = _.sample( candidatePairings[ name ] ); // Gifter is paired with a random name in his candidates list

        // Only remove when there was already a pairing for this person
        if (pairings[name].length >= 1) {
            delete candidatePairings[ name ]; // Gifter is removed so that they can't be a gifter anymore
        } else {
            // Otherwise, candidate is removed from list of gifter so they can't be chosen again by the same gifter
            candidatePairings[name] = _.without(candidatePairings[name], pairing);
        }

        timesChosen[pairing] += 1;

        // Candidate is removed from list of candidates for all yet-to-be-chosen gifters, but only when they've been paired twice already
        if (timesChosen[pairing] >= 2) {
            Object.keys( candidatePairings ).forEach( function ( name ) {
                candidatePairings[ name ] = _.without( candidatePairings[ name ], pairing );
            } );
        }

        pairings[ name ].push(pairing);

    }

    return pairings;

};
