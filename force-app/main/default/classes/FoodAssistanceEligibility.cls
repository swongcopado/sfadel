global class FoodAssistanceEligibility {
    // Original policy
    final static Date policy2015 = Date.valueOf('2015-01-01');
    final static Decimal percentIncomeForFood2015 = 0.20; 
    final static Decimal grossIncomeLimit2015= 10000;
    final static Decimal netIncomeLimit2015 = 7500;
    
    // 2018 Farm Bill
    final static Date policy2018 = Date.valueOf('2018-01-01');
    final static Decimal percentIncomeForFood2018 = 0.25; 
    final static Decimal grossIncomeLimit2018 = 15000;
    final static Decimal netIncomeLimit2018 = 10500;
    
    // 2021 Relief Bill
    final static Date policy2021 = Date.valueOf('2021-01-01');
    final static Decimal percentIncomeForFood2021 = 0.30; 
    final static Decimal grossIncomeLimit2021 = 20000;
    final static Decimal netIncomeLimit2021 = 12500;
    
    global static Boolean eligbleForFoodAssistance(Integer householdSize, 
                                                   Decimal grossIncome, 
                                                   Decimal netIncome,
                                                   Date effectiveDate) {
        
        Boolean eligible = false;
      
        if ((effectiveDate >= policy2015) && 
             (effectiveDate < policy2018)) {
                 
                 if (householdSize <= 3) {
                     if (grossIncome < grossIncomeLimit2015 && 
                         netIncome < netIncomeLimit2015) {
                         eligible = true;
                     }
                 }
        } else if ((effectiveDate >= policy2018) && 
             (effectiveDate < policy2021))  {
                 if (householdSize <= 3) {
                     if (grossIncome < grossIncomeLimit2018 && 
                         netIncome < netIncomeLimit2018) {
                         eligible = true;
                     }
                 }            
        }
        else if (effectiveDate >= policy2021) {
                 if (householdSize <= 3) {
                     if (grossIncome < grossIncomeLimit2021 && 
                         netIncome < netIncomeLimit2021) {
                         eligible = true;
                     }
                 }
        }
        return eligible;
    }
    
}