function calculateTeamFinanceReport(salaries, team) {
    const financeReport = {};

    // Initialize total budget for the team
    let totalBudgetTeam = 0;

    // Iterate over each member in the team
    team.forEach(member => {
        const specialization = member.specialization;
        const salary = salaries[specialization].salary;
        const tax = parseFloat(salaries[specialization].tax) / 100; // Convert tax percentage to decimal

        // Calculate total budget for the member
        const totalBudgetMember = Math.round(salary / (1 - tax)); // Apply tax to calculate total budget

        // Increment total budget for the team
        totalBudgetTeam += totalBudgetMember;

        // Increment total budget for each specialization
        if (!financeReport[`totalBudget${specialization}`]) {
            financeReport[`totalBudget${specialization}`] = 0;
        }
        financeReport[`totalBudget${specialization}`] += totalBudgetMember;
    });

    financeReport.totalBudgetTeam = totalBudgetTeam; // Set total budget for the team

    return financeReport;
}

// Test data
const salaries1 = {
    Manager: { salary: 1000, tax: "10%" },
    Designer: { salary: 600, tax: "30%" },
    Artist: { salary: 1500, tax: "15%" },
};
const team1 = [
    { name: "Misha", specialization: "Manager" },
    { name: "Max", specialization: "Designer" },
    { name: "Vova", specialization: "Designer" },
    { name: "Leo", specialization: "Artist" },
];

const financeReport1 = calculateTeamFinanceReport(salaries1, team1);
console.log(JSON.stringify(financeReport1));

//here
