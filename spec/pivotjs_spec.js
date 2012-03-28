describe('pivot', function () {
  var sample_csv;

  beforeEach(function () {
      sample_csv = "last_name,first_name,zip_code\n" +
                   "Jackson,Robert,34471\n" +
                   "Smith,Jon,34471\n" +
                   "Jackson,Jon,34474\n" +
                   "Jackson,Susan,34476\n" +
                   "Fornea,Chris,34474\n" +
                   "Fornea,Shelly,39401"

      pivot.fields().set([
        {name: 'last_name',  type: 'string',  filterable: true},
        {name: 'first_name', type: 'string',  filterable: true},
        {name: 'zip_code',   type: 'integer', filterable: true}
      ]);

      pivot.csv(sample_csv);
    });

  afterEach(function () {
    pivot.reset();
  });

  describe('CSV', function () {
    it('can parse csv into an array', function(){
      expect(pivot.data().raw[0]).toEqual({last_name:'Jackson',first_name:'Robert',zip_code: 34471});
      expect(pivot.data().raw.length).toEqual(6)
    });

    it('can filter items from csv', function() {
      expect(pivot.data().raw.length).toEqual(6);

      // apply filter
      pivot.filters().apply({last_name: 'Jackson'});
      expect(pivot.data().all.length).toEqual(3);
    });
  });

  describe('Filters', function() {
    beforeEach(function () {
      pivot.filters().set({last_name: 'Jackson'});
    });

    it('force type specifity on new filters', function(){
      pivot.filters().add({zip_code: '34471'})
      expect(pivot.filters().all.zip_code).toEqual(34471)
    });

    it('narrows filter and resets when filter chain is altered', function(){
      expect(pivot.data().all.length).toEqual(0);

      // apply filter
      pivot.filters().apply();
      expect(pivot.data().all.length).toEqual(3);

      // apply additional filter
      pivot.filters().add({first_name: 'Jon'});

      // with no params simply runs existing filters
      pivot.filters().apply()
      expect(pivot.data().all.length).toEqual(1);

      // reset original filter
      pivot.filters().apply({last_name: 'Fornea'});
      expect(pivot.data().all.length).toEqual(2);
    });
  });

  describe('Fields', function(){
    it('allows the specification of fields', function(){
      expect(pivot.fields().get('zip_code').type).toEqual("integer");
      expect(pivot.fields().get('zip_code').filterable).toBeTruthy();
    });

    it('allows for adding fields', function(){
      expect(pivot.fields().all().length).toEqual(3);
      pivot.fields().add({name:"not_a_real_fields", type: 'date', filterable: true})
       expect(pivot.fields().all().length).toEqual(4);
    });

    describe('Pseudo Fields', function(){
      beforeEach(function(){
        pivot.reset();
        pivot.fields().set([
          {name: 'last_name',  type: 'string',  filterable: true},
          {name: 'first_name', type: 'string',  filterable: true},
          {name: 'zip_code',   type: 'integer', filterable: true},
          {name: 'pseudo_zip', type: 'integer', filterable: true, pseudo: true, pseudoFunction: function(row){ return row.zip_code + 1}}
        ]);
        pivot.csv(sample_csv);
      });

      it('allows creating pseudo fields', function(){
        expect(pivot.data().raw[0].pseudo_zip).toEqual(34472);
      });

      it('captures values for filterable pseudo fields', function(){
        expect(Object.keys(pivot.fields().pseudo[0].values).length).toEqual(4);
      });
    });
  });

  describe('Display', function(){
    it('should allow set/get of label fields', function(){
      pivot.display().label().set(['last_name']);
      expect(Object.keys(pivot.display().label().get)).toEqual(['last_name']);
    });

    it('should allow set/get of summary fields', function(){
      pivot.display().summary().set(['last_name']);
      expect(Object.keys(pivot.display().summary().get)).toEqual(['last_name']);
    });
  });

  describe('Results', function(){
    it('should only return display fields that were selected', function(){

    });
  });
});