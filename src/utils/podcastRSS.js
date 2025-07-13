// RSS Feed Parser for Feed Forward podcast
import Parser from 'rss-parser';

const RSS_FEED_URL = 'https://anchor.fm/s/fd2c69bc/podcast/rss';

class PodcastRSSParser {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['itunes:duration', 'duration'],
          ['itunes:explicit', 'explicit'],
          ['itunes:episode', 'episodeNumber'],
          ['itunes:season', 'season'],
          ['itunes:author', 'author'],
          ['itunes:subtitle', 'subtitle'],
          ['itunes:summary', 'summary'],
          ['enclosure', 'audio']
        ]
      }
    });
  }

  async fetchFeed() {
    try {
      const feed = await this.parser.parseURL(RSS_FEED_URL);
      return this.transformFeedData(feed);
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      return this.getFallbackData();
    }
  }

  transformFeedData(feed) {
    const showInfo = {
      title: feed.title,
      description: feed.description,
      image: feed.image?.url,
      author: feed.managingEditor || 'Prass and James',
      link: feed.link,
      language: feed.language,
      lastBuildDate: feed.lastBuildDate
    };

    const episodes = feed.items.map((item, index) => ({
      id: item.guid || `episode-${index}`,
      title: item.title,
      description: item.contentSnippet || item.content || item.summary,
      pubDate: new Date(item.pubDate),
      duration: this.parseDuration(item.duration),
      audioUrl: item.audio?.url || item.enclosure?.url,
      link: item.link,
      episodeNumber: item.episodeNumber || (feed.items.length - index),
      season: item.season || 1,
      explicit: item.explicit === 'true',
      author: item.author || showInfo.author,
      subtitle: item.subtitle,
      summary: item.summary
    })).sort((a, b) => b.pubDate - a.pubDate); // Sort by newest first

    return {
      show: showInfo,
      episodes,
      totalEpisodes: episodes.length,
      latestEpisode: episodes[0],
      categories: this.extractCategories(episodes)
    };
  }

  parseDuration(duration) {
    if (!duration) return '00:00';
    
    // Handle different duration formats (HH:MM:SS, MM:SS, seconds)
    if (typeof duration === 'string') {
      if (duration.includes(':')) {
        return duration;
      } else {
        // Convert seconds to MM:SS or HH:MM:SS
        const totalSeconds = parseInt(duration);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      }
    }
    
    return duration?.toString() || '00:00';
  }

  extractCategories(episodes) {
    const categories = new Set();
    episodes.forEach(episode => {
      // Extract categories from titles and descriptions
      const text = `${episode.title} ${episode.description}`.toLowerCase();
      
      if (text.includes('ai') || text.includes('artificial intelligence')) categories.add('AI');
      if (text.includes('security') || text.includes('cybersecurity')) categories.add('Security');
      if (text.includes('energy') || text.includes('sustainability')) categories.add('Energy');
      if (text.includes('justice') || text.includes('ethics')) categories.add('Ethics');
      if (text.includes('technology') || text.includes('tech')) categories.add('Technology');
      if (text.includes('future') || text.includes('innovation')) categories.add('Future');
      if (text.includes('work') || text.includes('productivity')) categories.add('Work');
    });
    
    return Array.from(categories);
  }

  getFallbackData() {
    // Fallback data based on the RSS content we know
    return {
      show: {
        title: "Feed Forward",
        description: "Navigating the AI midlife crisis, one episode at a time",
        author: "Prass and James",
        image: "/images/podcasts/feed-forward.jpeg",
        link: "https://anchor.fm/s/fd2c69bc/podcast/rss"
      },
      episodes: [
        {
          id: "ep-8",
          title: "Generation Beta",
          description: "Exploring the next generation of AI and technology",
          pubDate: new Date("2025-02-16"),
          duration: "45:00",
          episodeNumber: 8,
          season: 1
        },
        {
          id: "ep-7", 
          title: "Deepseek: The Dawn of a New AI Arms Race?",
          description: "US-China AI competition and geopolitical implications",
          pubDate: new Date("2025-02-05"),
          duration: "1:30:44",
          episodeNumber: 7,
          season: 1
        },
        {
          id: "ep-6",
          title: "Algorithms and Justice",
          description: "Technology's role in crime prevention and justice",
          pubDate: new Date("2025-01-27"),
          duration: "1:05:21", 
          episodeNumber: 6,
          season: 1
        },
        {
          id: "ep-5",
          title: "The Energy Dilemma",
          description: "AI's energy consumption versus sustainability",
          pubDate: new Date("2024-12-11"),
          duration: "1:03:07",
          episodeNumber: 5,
          season: 1
        },
        {
          id: "ep-4",
          title: "ABD: Always be doing",
          description: "AI integration in workflows and future technology",
          pubDate: new Date("2024-11-25"),
          duration: "1:32:41",
          episodeNumber: 4,
          season: 1
        },
        {
          id: "ep-3",
          title: "Defending Against AI Threats",
          description: "Strategies to counter AI-driven security risks",
          pubDate: new Date("2024-11-18"),
          duration: "42:51",
          episodeNumber: 3,
          season: 1
        }
      ],
      totalEpisodes: 8,
      categories: ['AI', 'Technology', 'Security', 'Energy', 'Ethics', 'Future']
    };
  }
}

// Export function to get podcast data
export async function getPodcastData() {
  const parser = new PodcastRSSParser();
  return await parser.fetchFeed();
}

// Export function for static data (for build time)
export function getStaticPodcastData() {
  const parser = new PodcastRSSParser();
  return parser.getFallbackData();
}