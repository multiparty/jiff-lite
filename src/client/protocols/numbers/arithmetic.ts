/*

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
   
  SecretShare.prototype.sadd = function (o) {
   if (!(o.jiff === this.jiff)) {
     throw new Error('shares do not belong to the same instance (+)');
   }
   if (!this.jiff.helpers.Zp_equals(this, o)) {
     throw new Error('shares must belong to the same field (+)');
   }
   if (!this.jiff.helpers.array_equals(this.holders, o.holders)) {
     throw new Error('shares must be held by the same parties (+)');
   }

   // add the two shares when ready locally
   var self = this;
   var ready = function () {
     return self.jiff.helpers.mod(self.jiff.share_helpers['+'](self.value, o.value), self.Zp);
   };

   // promise to execute ready_add when both are ready
   return new this.jiff.SecretShare(this.when_both_ready(o, ready), this.holders, Math.max(this.threshold, o.threshold), this.Zp);
 };
 */

import { JiffClient } from '../../../jiffClient';

class SecretShare {
   jiff: JiffClient;
   holders: any[];
   threshold: number;
   Zp: number;
   value: any;

   constructor(jiff: JiffClient, holders: any[], threshold: number, Zp: number, value: any) {
      this.jiff = jiff;
      this.holders = holders;
      this.threshold = threshold;
      this.Zp = Zp;
      this.value = value;
   }

   when_both_ready(o: SecretShare, ready: Function): Promise<any> {
      // Implementation of when_both_ready goes here
      return new Promise((resolve, reject) => {
         // ...
      });
   }

   async sadd(o: SecretShare): Promise<SecretShare> {
      if (!(o.jiff === this.jiff)) {
         throw new Error('shares do not belong to the same instance (+)');
      }
      if (!this.jiff.helpers.Zp_equals(this, o)) {
         throw new Error('shares must belong to the same field (+)');
      }
      if (!this.jiff.helpers.array_equals(this.holders, o.holders)) {
         throw new Error('shares must be held by the same parties (+)');
      }

      // add the two shares when ready locally
      let self = this;
      let ready = function () {
         return self.jiff.helpers.mod(self.jiff.share_helpers['+'](self.value, o.value), self.Zp);
      };

      // promise to execute ready_add when both are ready
      return new SecretShare(await this.when_both_ready(o, ready), this.holders, Math.max(this.threshold, o.threshold), this.Zp, this.value);
   }
}