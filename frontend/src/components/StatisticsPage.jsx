import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Divider,
  CircularProgress,
  Link,
} from "@mui/material";
import { getStatsByShortcode } from "../api/stats";
import logger from "../middleware/logger";

const StatisticsPage = () => {
  const [shortcodes, setShortcodes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load shortcodes from localStorage only once
  useEffect(() => {
    const stored = localStorage.getItem("shortcodes");
    const parsed = stored ? JSON.parse(stored) : [];

    // If no shortcodes found, set a default one for demo
    const codesToTrack = parsed.length > 0 ? parsed : ["demo123"];
    setShortcodes(codesToTrack);
  }, []);

  // Fetch stats for each shortcode
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const fetchedStats = await Promise.all(
          shortcodes.map(async (code) => {
            const data = await getStatsByShortcode(code);
            return { shortcode: code, ...data };
          })
        );
        setStats(fetchedStats);
        logger.info("Statistics fetched", { stats: fetchedStats });
      } catch (error) {
        logger.error("Failed to fetch statistics", { error });
      } finally {
        setLoading(false);
      }
    };

    if (shortcodes.length > 0) {
      fetchStats();
    }
  }, [shortcodes]);

  if (loading) {
    return (
      <Container>
        <Box className="text-center mt-10">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-10">
      <Typography variant="h4" gutterBottom>
        📊 URL Statistics
      </Typography>

      {stats.length === 0 ? (
        <Typography>No stats available.</Typography>
      ) : (
        <Grid container spacing={4}>
          {stats.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Link
                      href={`http://localhost:5000/${item.shortcode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 {item.shortcode}
                    </Link>
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Original URL: {item.url || "N/A"}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Created At:{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Expiry:{" "}
                    {item.expiry
                      ? new Date(item.expiry).toLocaleString()
                      : "Never"}
                  </Typography>

                  <Typography variant="body1" className="mt-2">
                    🔁 Total Clicks: <strong>{item.clicks?.length || 0}</strong>
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {item.clicks?.length > 0 ? (
                    item.clicks.map((click, i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">
                          {new Date(click.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          Referrer: {click.referrer || "N/A"}
                        </Typography>
                        <Typography variant="body2">
                          Location: {click.location || "Unknown"}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No clicks recorded.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StatisticsPage;
