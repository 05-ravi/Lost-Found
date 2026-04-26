const calculateRelevance = (foundItem, lostReports) => {
    let highestScore = 0;
    let bestMatchLevel = "none";
    let bestMatchedReportId = null;

    for (const lostReport of lostReports) {
        let score = 0;

        // Category check
        if (foundItem.category === lostReport.category) {
            score += 50;
        }

        // Date check
        const foundDate = new Date(foundItem.dateOccurred);
        const lostDate = new Date(lostReport.dateOccurred);
        // Diff in days
        const diffInDays = Math.abs((foundDate - lostDate) / (1000 * 60 * 60 * 24));
        
        if (diffInDays <= 3) {
            score += 30;
        } else if (diffInDays <= 7) {
            score += 20;
        } else if (diffInDays <= 14) {
            score += 10;
        }

        // Location check
        if (foundItem.location?.text && lostReport.location?.text) {
            const foundLoc = foundItem.location.text.toLowerCase();
            const lostLoc = lostReport.location.text.toLowerCase();

            if (foundLoc === lostLoc) {
                score += 20;
            } else {
                const foundWords = foundLoc.split(/[\s,]+/);
                const lostWords = lostLoc.split(/[\s,]+/);
                
                // Exclude very short words from triggering naive matches
                const hasMatch = foundWords.some(word => word.length > 3 && lostWords.includes(word));
                if (hasMatch) {
                    score += 10;
                }
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatchedReportId = lostReport._id;
        }
    }

    let matchLevel = "none";
    if (highestScore >= 90) matchLevel = "perfect";
    else if (highestScore >= 70) matchLevel = "high";
    else if (highestScore >= 50) matchLevel = "possible";

    return {
        score: highestScore,
        matchLevel,
        matchedLostReportId: bestMatchedReportId
    };
};

module.exports = { calculateRelevance };
