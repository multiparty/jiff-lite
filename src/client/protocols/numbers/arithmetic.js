/**
   * Addition of two secret shares.
   * @method sadd
   * @param {module:jiff-client~JIFFClient#SecretShare} o - the share to add to this share.
   * @return {module:jiff-client~JIFFClient#SecretShare} this party's share of the result.
   * @memberof module:jiff-client~JIFFClient#SecretShare
   * @instance
   *
   * @example
   * // share a value with all parties, and sum the values of all shares
   * var shares = jiff_instance.share(x);
   * var sum = shares[1];
   * for (var i = 2; i <= jiff_instance.party_count; i++) {
   *  sum = sum.sadd(shares[i]);
   * }
   *
   */