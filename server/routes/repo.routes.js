const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const { logRepoActivity } = require("../middleware/activity.middleware");
const {
  analyzeRepository,
  aiScanRepository,
  malwareCheckRepository,
  malwareZipScanRepository,
  malwareCombinedScanRepository,
  malwarePipelineScanRepository,
  userAnomalyProfileRepository,
  collaboratorOutliersRepository,
} = require("../controllers/repo.controllers");

router.post("/analyze", auth, logRepoActivity("REPO_ANALYZE_HUMAN"), analyzeRepository);
router.post("/ai-scan", auth, logRepoActivity("REPO_ANALYZE_AI"), aiScanRepository);
router.post("/malware-check", auth, logRepoActivity("REPO_MALWARE_CHECK"), malwareCheckRepository);
router.post("/malware-zip-scan", auth, logRepoActivity("REPO_MALWARE_ZIP_SCAN"), malwareZipScanRepository);
router.post("/malware-combined-scan", auth, logRepoActivity("REPO_MALWARE_COMBINED_SCAN"), malwareCombinedScanRepository);
router.post("/malware-pipeline-scan", auth, logRepoActivity("REPO_MALWARE_PIPELINE_SCAN"), malwarePipelineScanRepository);
router.post("/anomaly-scan", auth, logRepoActivity("REPO_ANOMALY_SCAN"), malwarePipelineScanRepository); // same endpoint, different logic inside
router.post("/user-anomaly-profile", auth, logRepoActivity("USER_ANOMALY_PROFILE"), userAnomalyProfileRepository);
router.post("/collaborator-outliers", auth, logRepoActivity("COLLABORATOR_OUTLIERS"), collaboratorOutliersRepository);

module.exports = router;
