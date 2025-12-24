/**
 * English Locale
 */

export default {
    // App-wide
    app: {
        name: 'ByeByeSmoke',
        tagline: 'Your path to a smoke-free life'
    },

    // Common
    common: {
        loading: 'Loading...',
        close: 'Close'
    },

    // Accessibility
    accessibility: {
        skipToContent: 'Skip to main content',
        skipToNav: 'Skip to navigation'
    },

    // Navigation tabs
    nav: {
        overview: 'Overview',
        milestones: 'Milestones',
        achievements: 'Achievements',
        statistics: 'Statistics',
        help: 'Help',
        mainNavigation: 'Main navigation'
    },

    // Header
    header: {
        skipToContent: 'Skip to content',
        language: 'Change language',
        share: 'Share',
        darkMode: 'Toggle dark mode',
        tutorial: 'Help & Guide',
        settings: 'Settings',
        logout: 'Log out'
    },

    // Demo mode
    demo: {
        banner: 'Demo mode active',
        hint: 'All data is sample data.',
        register: 'Register now',
        login: 'Log in',
        actionBlocked: '{operation} is not available in test mode.\n\nRegister for free to use all features!'
    },

    // Authentication
    auth: {
        notLoggedIn: 'Not logged in',
        registerFailed: 'Registration failed',
        usernameTaken: 'Username already taken',
        passwordWeak: 'Password too weak (at least 6 characters)',
        loginFailed: 'Login failed',
        invalidCredentials: 'Invalid username or password',
        invalidUsername: 'Invalid username',
        logoutFailed: 'Logout failed',
        userDataNotFound: 'User data not found',
        saveDataAction: 'Save data',
        deleteAccountAction: 'Delete account',
        deleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone!',
        deleteSuccess: 'Account successfully deleted',
        deleteReloginRequired: 'Please log in again to delete your account.',
        deleteError: 'Error deleting account: {message}'
    },

    // Rate limiting
    rateLimit: {
        limitReachedToast: 'Daily limit reached ({limit}x). Try again tomorrow.',
        limitReachedAlert: 'You have reached the daily limit for this action ({limit}x per day).\n\nPlease try again tomorrow.',
        lastChangeToast: 'Last change for today - keeps the app free!',
        lastChangeAlert: 'Note: This is your last change for today.\n\nTo keep the app free, the number of saves per day is limited ({limit}x).',
        cravingLimitReached: 'Daily limit reached - Timer works, but no longer counted'
    },

    // Network status
    network: {
        noConnection: 'No internet connection',
        offlineWarning: 'Offline - Changes will not be saved',
        backOnline: 'Back online',
        connectionProblem: 'Connection problem'
    },

    // Login
    login: {
        button: 'Log in',
        loggingIn: 'Logging in...',
        tooManyAttempts: 'Too many login attempts. Please wait {time}.',
        tooManyFailed: 'Too many failed attempts. Please wait {time}.',
        attemptsRemaining: '{count} attempts remaining',
        loadingDemo: 'Loading demo...',
        tryDemo: 'Try it first',
        demoNotSetup: 'Demo account is not set up yet. Please contact support.',
        demoError: 'Demo login error: {message}'
    },

    // Register
    register: {
        button: 'Register',
        registering: 'Registering...',
        tooManyAttempts: 'Too many registration attempts. Please wait {time}.',
        tooManyFailed: 'Too many failed attempts. Please wait {time}.',
        attemptsRemaining: '{count} attempts remaining',
        validation: {
            usernameLength: 'Username must be between 3 and 50 characters',
            usernameChars: 'Username may only contain letters, numbers, _ and -',
            quitDateFuture: 'Quit date cannot be in the future',
            cigarettesPerDay: 'Cigarettes per day must be between 1 and 200',
            pricePerPack: 'Price per pack must be at least 0',
            cigarettesPerPack: 'Cigarettes per pack must be between 1 and 100',
            passwordLength: 'Password must be at least 6 characters'
        }
    },

    // Dashboard / Overview
    dashboard: {
        motivation: {
            title: 'Daily Motivation'
        },
        bodyRecovery: {
            title: 'Your body is recovering',
            subtitle: 'Watch your body heal in real-time!'
        },
        // Health Avatar section (HTML data-i18n keys)
        healthAvatar: {
            title: '🫁 Your body is recovering',
            subtitle: 'Watch your body heal in real-time!',
            lungs: 'Lungs',
            heart: 'Heart',
            blood: 'Circulation',
            skin: 'Skin'
        },
        progress: {
            title: 'Your Progress',
            days: 'Days',
            money: 'Money',
            cigarettes: 'Cigarettes',
            goalDays: 'Goal: {count} days',
            goalMoney: 'Goal: {amount}€',
            goalCigarettes: 'Goal: {count}',
            // Gauge titles (HTML data-i18n keys)
            daysSmokeFree: 'Days smoke-free',
            moneySaved: 'Money saved',
            cigarettesAvoided: 'Cigarettes avoided'
        },
        stats: {
            daysSmokeFree: 'Time smoke-free',
            daysSmokeFreeInfo: 'Since you quit',
            sinceStopped: 'Since you quit',
            moneySaved: 'Money saved',
            basedOn: 'Based on {cigs} cigs/day at {price}',
            cigarettesNotSmoked: 'Not smoked',
            cigarettesAvoided: '{count} cigarettes per day avoided',
            lifeGained: 'Life gained',
            lifeGainedInfo: '17-22 min per cigarette (Jackson 2025)',
            toxinsAvoided: 'Toxins avoided',
            toxinsAvoidedInfo: 'Nicotine, tar & more',
            toxinsInfo: 'Nicotine, tar & more',
            lungHealth: 'Lung health',
            lungHealthInfo: 'Recovery over 10 years',
            timeSaved: 'Time saved',
            timeSavedInfo: '~5 min per cigarette (incl. preparation)',
            co2Avoided: 'CO₂ avoided',
            co2Info: '~14g CO₂ per cigarette',
            skinImprovement: 'Skin improvement',
            skinImprovementInfo: 'Significant improvement from 6 months (Milan study)',
            skinInfo: 'Significant improvement from 6 months'
        },
        environment: {
            title: '🌱 Your environmental impact',
            // Keys for HTML data-i18n
            water: 'Liters of water saved',
            waterInfo: 'Cigarette production uses ~3.7L per cigarette',
            trees: 'Trees protected',
            treesInfo: '~1 tree is needed for drying per 300 cigarettes',
            co2: 'CO₂ avoided',
            co2Info: '~14g CO₂ per cigarette (production + transport)',
            // Legacy keys
            waterSaved: 'Liters of water saved',
            treesProtected: 'Trees protected',
            co2Avoided: 'CO₂ avoided'
        },
        streak: {
            title: 'App streak',
            days: 'Days in a row',
            text: 'You have been using the app for {count} days in a row. Keep it up!'
        },
        nextMilestone: {
            title: 'Next Goal',
            allComplete: 'All milestones reached!',
            allCompleteDesc: 'You have mastered all health milestones!'
        },
        comparison: {
            exceptional: 'You are exceptional!',
            topPercent: 'You are among the strongest {percent}%!',
            everyMinuteCounts: 'Every minute counts!',
            strongerThanMany: 'You are already stronger than many who never even try.',
            firstHoursCritical: 'The first hours are crucial - you can do this!'
        }
    },

    // Health Avatar
    avatar: {
        heart: 'Heart',
        lungs: 'Lungs',
        blood: 'Blood vessels',
        brain: 'Brain',
        skin: 'Skin'
    },

    // Health Avatar Status & Tooltips
    healthAvatar: {
        lung: {
            status: '{percent}% regenerated',
            tooltip: '🫁 Lungs: {percent}% regenerated'
        },
        heart: {
            status: '{percent}% normalized',
            tooltip: '❤️ Heart: {percent}% normalized'
        },
        blood: {
            status: '{percent}% improved',
            tooltip: '🩸 Circulation: {percent}% improved'
        },
        skin: {
            status: '{percent}% rejuvenated',
            tooltip: '✨ Skin: {percent}% rejuvenated'
        }
    },

    // Milestones (HTML data-i18n keys)
    milestones: {
        happeningNow: {
            title: '⏰ What is happening NOW in your body?'
        },
        healthMilestones: {
            title: 'Health Milestones'
        }
    },

    // Milestones Section
    milestonesSection: {
        title: 'Health Milestones',
        subtitle: 'Your body recovers with each day',
        happeningNow: 'What is happening NOW in your body',
        reached: 'Reached',
        inProgress: 'In progress',
        upcoming: 'Upcoming',
        timeRemaining: '{time} remaining'
    },

    // Happening Now
    happeningNow: {
        justReached: 'Just reached!',
        activePhase: 'Active Phase',
        nextPhase: 'Next phase ({title}) in {time}',
        allAchieved: 'All health milestones achieved!',
        lessThanOneDay: 'less than 1 day',
        yearsAndMonths: '{years} year(s) and {months} month(s)'
    },

    // Achievements (HTML data-i18n key)
    achievements: {
        title: 'Achievements'
    },

    // Achievements Section
    achievementsSection: {
        title: 'Your Achievements',
        subtitle: 'Celebrate your milestones',
        unlocked: 'Unlocked',
        locked: 'Not yet reached',
        progress: '{current} of {total}',
        categories: {
            time: 'Time',
            money: 'Money',
            cigarettes: 'Cigarettes',
            life: 'Life time',
            lung: 'Lung health',
            water: 'Water',
            co2: 'CO₂',
            timeSaved: 'Time saved'
        }
    },

    // Statistics
    statistics: {
        title: 'Your Statistics',
        healthScore: {
            title: 'Health Score',
            subtitle: 'Weighted average of 5 recovery metrics',
            rating: {
                excellent: 'Excellent!',
                veryGood: 'Very good!',
                good: 'Good!',
                progress: 'Progress!',
                started: 'Started!'
            },
            message: {
                excellent: 'Your health has recovered excellently!',
                veryGood: 'You are making great progress!',
                good: 'Your body is steadily recovering.',
                progress: 'Recovery has begun.',
                started: 'First positive changes are underway.'
            },
            explanation: 'Weighted average of 5 recovery metrics, based on WHO, JAMA and PMC studies.',
            viewSources: 'View sources',
            components: {
                cardiovascular: {
                    label: 'Cardiovascular',
                    desc: 'Leading cause of death in smokers. 15 years to non-smoker level.'
                },
                lung: {
                    label: 'Lung function',
                    desc: 'COPD, lung cancer. 10 years to full recovery.'
                },
                circulation: {
                    label: 'Circulation',
                    desc: 'Peripheral vessels. Quick recovery in 6 months.'
                },
                risk: {
                    label: 'Risk reduction',
                    desc: 'Heart attack, stroke, cancer. Long-term protection.'
                },
                skin: {
                    label: 'Skin health',
                    desc: 'Visible indicator of regeneration. 9 months.'
                }
            }
        },
        lotus: {
            title: '🪷 Your Lotus',
            subtitle: '– Health Score',
            outOf: 'out of 100',
            preview: 'Watch growth',
            previewPlaying: 'Playing...',
            stageFormat: '{name} (Stage {current}/{total})',
            nextStageAt: 'At {points} points: {stage}',
            fullBloomReached: 'Your lotus has reached its full beauty',
            stages: {
                seed: 'Seed',
                seedDesc: 'A seed rests in the soil',
                sprout: 'Seedling',
                sproutDesc: 'The seed begins to germinate',
                youngSprout: 'Young sprout',
                youngSproutDesc: 'A tender sprout grows upward',
                sproutLeaves: 'Sprout with leaves',
                sproutLeavesDesc: 'Small leaves unfold',
                floatingLeaf: 'Floating leaf',
                floatingLeafDesc: 'The first leaf floats on the water',
                largeLeaf: 'Large lotus leaf',
                largeLeafDesc: 'A magnificent lotus leaf spreads out',
                smallBud: 'Small bud',
                smallBudDesc: 'A delicate bud forms',
                largeBud: 'Large bud',
                largeBudDesc: 'The bud is ready to open',
                openingFlower: 'Opening flower',
                openingFlowerDesc: 'The flower begins to unfold',
                fullBloom: 'Full bloom',
                fullBloomDesc: 'Your lotus shines in full splendor!'
            },
            nextStage: 'At {points} points: {stage}'
        },
        comparison: {
            title: 'Comparison',
            header: {
                milestone: 'Milestone',
                average: 'On average succeed',
                status: 'Your status'
            },
            milestones: {
                '24h': '24 hours',
                '3d': '3 days',
                '1w': '1 week',
                '2w': '2 weeks',
                '1m': '1 month',
                '3m': '3 months',
                '6m': '6 months',
                '1y': '1 year'
            },
            ofPeople: '% of people',
            achieved: 'Achieved',
            notYet: 'Not yet'
        },
        ageGroup: {
            title: 'Age group comparison',
            youAreHere: 'You are here!',
            giveUpBefore: 'give up before',
            failBefore: 'fail before',
            giveUp: 'give up',
            failWeek1: 'fail in week 1',
            giveUp24h: 'give up in 24h',
            stayStrong: 'stay on track',
            '6m': {
                title: 'You are absolutely exceptional!',
                text: 'In the age group {ageGroup}, only <strong>1% of people</strong> manage to stay smoke-free for the first 6 months.',
                highlight: 'You are in the top 1%!'
            },
            '3m': {
                title: 'You are extraordinarily strong!',
                text: 'In the age group {ageGroup}, only <strong>2% of people</strong> make it through the first 3 months.',
                highlight: 'You are in the top 2%!'
            },
            '1m': {
                title: 'Impressive achievement!',
                text: 'In the age group {ageGroup}, only <strong>3% of people</strong> make it through the first month.',
                highlight: 'You are in the top 3%!'
            },
            '1w': {
                title: 'Great job!',
                text: 'In the age group {ageGroup}, only <strong>5% of people</strong> make it through the first week.',
                highlight: 'You are in the top 5%!'
            },
            start: {
                title: 'Strong start!',
                text: 'In the age group {ageGroup}, many try to quit, but most give up in the first few days.',
                highlight: 'You have already taken the most important step!'
            }
        },
        timeline: {
            title: 'Milestone Timeline',
            '1d': '1 day',
            '3d': '3 days',
            '1w': '1 week',
            '2w': '2 weeks',
            '1m': '1 month',
            '3m': '3 months',
            '6m': '6 months',
            '1y': '1 year',
            '2y': '2 years',
            '5y': '5 years',
            '10y': '10 years',
            still: 'Still',
            days: 'days'
        },
        projection: {
            title: 'Future Projection',
            in1m: 'In 1 month',
            in3m: 'In 3 months',
            in6m: 'In 6 months',
            in1y: 'In 1 year',
            saved: 'saved',
            avoided: 'avoided',
            lifeGained: 'life gained'
        },
        goalCalculator: {
            title: '🎯 Your personal goal',
            intro: 'Calculate how long it takes or what you will achieve!',
            byDays: 'By days',
            byMoney: 'By money',
            howManyDays: 'How many days?',
            howMuchMoney: 'How much money (€)?',
            daysPlaceholder: 'e.g. 100',
            moneyPlaceholder: 'e.g. 2000',
            daysLabel: 'In how many days?',
            moneyLabel: 'How much money to save?',
            calculate: 'Calculate',
            result: 'Result',
            inDays: 'In {days} days you will:',
            toSave: 'To save {amount}:',
            needDays: 'you need {days} days',
            willSave: 'have saved {amount}',
            willAvoid: 'have avoided {count} cigarettes',
            willGain: 'have gained {time} of life',
            alerts: {
                invalidDays: 'Please enter a valid number of days!',
                invalidMoney: 'Please enter a valid amount!'
            },
            achieved: '{percent}% achieved',
            days: 'days',
            yourGoal: 'Your goal',
            reachedOn: 'Reached on: {date}',
            moneySaved: 'Money saved',
            cigarettesAvoided: 'Cigarettes avoided',
            lifeGained: 'Life gained',
            savingsGoal: 'Your savings goal',
            timeNeeded: 'Time needed'
        },
        // Chart titles (HTML data-i18n keys)
        progressChart: {
            title: 'Progress'
        },
        cravingChart: {
            title: '📊 Your overcome cravings',
            subtitle: 'Last 30 days'
        },
        heatmap: {
            title: '🔥 When do cravings occur?',
            subtitle: 'Patterns of the last 30 days by weekday and time'
        },
        // Age comparison (HTML uses ageComparison, locale has ageGroup)
        ageComparison: {
            title: '👥 Comparison with your age group'
        }
    },

    // SOS / Help
    sos: {
        button: 'Acute craving',
        buttonHint: 'Click here for immediate support with a 5-minute timer',
        hint: 'Click here for immediate support',
        timer: {
            title: 'Craving Timer',
            remaining: 'remaining',
            breatheIn: 'Breathe in',
            breatheOut: 'Breathe out',
            hold: 'Hold',
            tip: 'Tip'
        },
        tabs: {
            tips: 'Tips',
            breathing: 'Breathing',
            games: 'Games'
        },
        // Tips section (HTML data-i18n keys)
        tips: {
            title: '💡 Tips for acute cravings',
            fiveMinRule: {
                title: '5-minute rule',
                text: 'Wait 5 minutes. The craving will weaken on its own!'
            },
            water: {
                title: 'Drink water',
                text: 'Drinking a large glass of water distracts and helps.'
            },
            walk: {
                title: 'Short walk',
                text: 'Move for 5-10 minutes. Fresh air helps!'
            },
            breathe: {
                title: 'Deep breathing',
                text: 'Breathe deeply 10 times. Calms immediately.'
            },
            call: {
                title: 'Call someone',
                text: 'Call a supportive person and talk.'
            },
            snack: {
                title: 'Healthy snack',
                text: 'Fruit, vegetables or gum distract the mouth.'
            }
        },
        // Shocking facts (HTML data-i18n keys)
        shockingFacts: {
            title: '⚠️ Why you quit',
            intro: 'These facts remind you why every cigarette would be a mistake:',
            fact1: {
                number: '170,000',
                label: 'Deaths per year in Germany',
                detail: 'Every 7th death caused by smoking'
            },
            fact2: {
                number: '8 million',
                label: 'Deaths worldwide per year',
                detail: 'More than alcohol, AIDS & drugs combined'
            },
            fact3: {
                number: '-10 years',
                label: 'Life expectancy',
                detail: 'Smokers die on average 10 years earlier'
            },
            fact4: {
                number: '90%',
                label: 'Lung cancer from smoking',
                detail: '7x higher risk than non-smokers'
            },
            fact5: {
                number: '3x',
                label: 'Heart attack risk',
                detail: 'Stroke risk 2-3x higher'
            },
            fact6: {
                number: '88,000',
                label: 'New cancer cases/year (DE)',
                detail: 'Caused by smoking alone'
            },
            fact7: {
                number: '90%',
                label: 'COPD patients',
                detail: 'Are or were smokers'
            },
            fact8: {
                number: '17-22 min',
                label: 'Life time per cigarette',
                detail: 'Every cigarette shortens your life (Jackson 2025)'
            },
            fact9: {
                number: 'Smoker\'s leg',
                label: 'Amputation risk',
                detail: 'Circulation problems in legs'
            },
            fact10: {
                number: 'Blindness',
                label: 'Retinal degeneration',
                detail: 'Smoking damages the eyes'
            },
            fact11: {
                number: 'Infertility',
                label: 'Erectile dysfunction',
                detail: 'Poor sperm quality'
            },
            fact12: {
                number: 'Tooth loss',
                label: 'Gum disease',
                detail: '2x higher risk of tooth loss'
            },
            reminder: '<strong>Every craving passes.</strong> You are stronger than the addiction. Remember why you quit!'
        },
        // Overlay (HTML data-i18n keys)
        overlay: {
            close: 'Close',
            title: 'SOS Help',
            remaining: 'remaining',
            countAsCraving: 'Count as craving',
            tabs: {
                tips: '💡 Tips',
                breathing: '🧘 Breathing',
                games: '🎮 Games'
            }
        },
        // Breathing exercises (HTML data-i18n keys)
        breathing: {
            title: 'Breathing Exercises',
            exerciseTitle: 'Breathing Exercise',
            boxBreathing: 'Box Breathing',
            boxBreathingDesc: '4 seconds in, 4 hold, 4 out, 4 hold',
            technique478: '4-7-8 Technique',
            technique478Desc: '4 seconds in, 7 hold, 8 out',
            stop: 'Stop exercise',
            box: {
                name: 'Box Breathing',
                detail: '4-4-4-4 | ~2 min | Focus'
            },
            '478': {
                name: '4-7-8 Technique',
                detail: '4-7-8 | ~2.5 min | Relaxation'
            },
            urgeSurfing: {
                name: 'Urge Surfing',
                detail: '~5 min | Mindfulness | Evidence-based'
            }
        },
        games: {
            title: 'Distraction Games',
            tapChallenge: 'Tap Challenge',
            tapChallengeDesc: 'Tap as fast as you can',
            memory: 'Memory',
            memoryDesc: 'Find the pairs',
            breathTrainer: 'Breath Trainer',
            breathTrainerDesc: 'Follow the breathing rhythm'
        },
        success: {
            title: 'You did it!',
            message: 'You overcame the craving!',
            timeHeld: 'You held on for {time}.',
            cravingCount: 'That was your {count}. craving overcome today!',
            notCounted: 'Not counted as craving.'
        },
        countAsCraving: 'Count as craving',
        dontCount: 'Don\'t count',
        stop: 'Stop',
        cravingStats: {
            title: '💪 Your victories over cravings',
            today: 'Overcome today',
            weekAvg: 'Avg per day (7 days)',
            monthTotal: 'Total (30 days)',
            trendDecreasing: 'Trend: Decreasing',
            trendIncreasing: 'Trend: Increasing',
            trendStable: 'Trend: Stable'
        },
        heatmap: {
            title: 'Craving Heatmap',
            loading: 'Loading heatmap...',
            noData: 'No craving data yet.',
            hint: 'Use the craving timer to track your cravings.',
            insights: 'Insights',
            peakDay: 'Most cravings on {day}',
            peakTime: 'Critical time: {time}',
            noCravingDay: 'No cravings on {day} - well done!',
            notEnoughData: 'Not enough data for insights yet',
            total: 'Total: {count} cravings in the last 30 days',
            less: 'Less',
            more: 'More'
        }
    },

    // Craving Timer (inline game/breathing translations)
    cravingTimer: {
        tips: {
            breathe: 'Breathe in deeply and exhale slowly. Count to 4.',
            strong: 'You are stronger than any craving. You can do this!',
            fewMinutes: 'Just a few more minutes. The craving is getting weaker!',
            wave: 'Let the craving wash over you like a wave.',
            goal: 'Think of your goal: A healthier, free life!',
            water: 'Drink a large glass of water - it helps immediately.',
            move: 'Move! Take a few steps or stretch.',
            focus: 'Focus on your breath. In... Out... In... Out...',
            healing: 'Your body is healing right now. Every second counts!',
            achieved: 'You have already achieved so much. Don\'t give up now!',
            stronger: 'Every craving you overcome makes you stronger!',
            roleModel: 'You are a role model for others. Stay strong!',
            // Exercise prompts - evidence: 12 studies show up to 50 min reduced cravings (smokefree.gov)
            squats: 'Do 10 squats now! Exercise reduces cravings instantly.',
            stairs: 'Walk up and down a staircase - scientifically proven to help!',
            stretch: 'Stretch for 1 minute. Arms up, to the sides, forward!',
            walk: 'Walk in place for 2 minutes. Every movement counts!',
            pushups: 'Can you do 5 push-ups? Or against the wall? Try it!'
        },
        breathing: {
            inhale: 'Breathe in',
            exhale: 'Breathe out',
            hold: 'Hold',
            cycle: 'Cycle {current} of {total}',
            done: 'Done!',
            completed: 'Exercise completed'
        },
        // Urge Surfing - technique by Dr. Alan Marlatt, University of Washington
        // Evidence: 26% reduction in smoking (https://pubmed.ncbi.nlm.nih.gov/20025372/)
        urgeSurfing: {
            notice: 'Notice the craving',
            noticeDesc: 'Close your eyes. Acknowledge that you have a craving.',
            bodyAwareness: 'Where do you feel it?',
            bodyDesc: 'Scan your body. Chest? Hands? Mouth? Stomach?',
            observe: 'Observe the sensation',
            observeDesc: 'How does it feel? Tingling? Pressure? Warmth? Cold?',
            breathe: 'Breathe through the wave',
            breatheDesc: 'Breathe in slowly... and out. The wave is rising...',
            peak: 'The wave reaches its peak',
            peakDesc: 'Hold on. Every wave breaks. Keep breathing.',
            subside: 'The wave subsides',
            subsideDesc: 'Feel the craving fading. You made it.',
            reflect: 'Reflection',
            reflectDesc: 'You survived the craving without smoking.',
            done: 'Wave conquered!',
            source: 'Technique by Dr. Alan Marlatt, University of Washington'
        },
        games: {
            points: 'Points',
            time: 'Time',
            back: 'Back',
            playAgain: 'Play again',
            super: 'Super!',
            good: 'Good!',
            keepPracticing: 'Keep practicing!',
            breatheIn: 'Breathe in...',
            breatheOut: 'Breathe out...',
            breaths: 'breaths',
            breatheResult: '5 deep breaths - well done!',
            moves: 'Moves',
            found: 'Found',
            perfect: 'Perfect!',
            veryGood: 'Very good!',
            wellDone: 'Well done!'
        },
        success: {
            minute: 'minute',
            minutes: 'minutes',
            seconds: 'seconds',
            and: 'and',
            cravingCount: 'That was your {count}. craving overcome today!',
            heldOn: 'You held on for <strong>{time}</strong>.',
            notCounted: 'Not counted as craving.',
            totalDays: 'Total smoke-free: <strong>{days} days</strong>',
            saved: 'Saved: <strong>{amount}€</strong>'
        }
    },

    // Craving tips
    cravingTips: [
        'Breathe in deeply and exhale slowly. Count to 4.',
        'Drink a large glass of cold water.',
        'Go outside for some fresh air.',
        'Chew some gum or suck on a candy.',
        'Distract yourself with a quick game.',
        'Remember your reasons for quitting.',
        'The craving will pass in a few minutes!',
        'You are stronger than any craving. You can do this!',
        'Think about the money you\'re saving.',
        'Imagine how good it feels to breathe freely.',
        'Call a friend or send a message.',
        'Do 10 squats or push-ups.'
    ],

    // Shocking facts
    shockingFacts: {
        title: 'Did you know?',
        facts: [
            'A cigarette contains over 7,000 chemicals, at least 70 of which are carcinogenic.',
            'Smoking shortens life by an average of 10 years.',
            'Every 6 seconds, someone dies from the effects of smoking worldwide.',
            'Passive smoking kills over 600,000 people worldwide each year.',
            'Cigarette filters take up to 15 years to decompose.',
            'Smokers have a 25x higher risk of lung cancer than non-smokers.',
            'A pack of cigarettes reduces your life by about 5 hours.',
            'Tobacco farming consumes 22 billion tons of water per year.',
            'Smoking causes 90% of all lung cancer cases.',
            'Ex-smokers live on average 10 years longer than active smokers.',
            'Your heart attack risk drops just 24 hours after your last cigarette.',
            'After 15 years, your risk of heart disease equals that of non-smokers.'
        ]
    },

    // Settings
    settings: {
        title: '⚙️ Settings',
        close: 'Close settings',
        // Language section (HTML data-i18n keys)
        language: {
            title: '🌐 Language'
        },
        // Account section (HTML data-i18n keys)
        account: {
            title: 'Account',
            loggedInAs: 'Logged in as:'
        },
        // Data section (HTML data-i18n keys)
        data: {
            title: '📊 Edit my data',
            quitDate: 'Quit date & time',
            cigarettesPerDay: 'Cigarettes per day (before)',
            pricePerPack: 'Price per pack (€)',
            cigarettesPerPack: 'Cigarettes per pack',
            save: 'Save'
        },
        // Notifications section (HTML data-i18n keys)
        notifications: {
            title: '🔔 Notifications',
            description: 'Receive notifications while the app is open.',
            push: {
                label: 'Enable notifications',
                description: 'Allow the app to send you notifications'
            },
            milestones: {
                label: 'Milestone notifications',
                description: 'When reaching a health milestone'
            },
            daily: {
                label: 'Daily motivation',
                description: 'Once daily at 10:00 AM (when app is open)'
            }
        },
        // Export section (HTML data-i18n keys)
        export: {
            title: '📦 Your data',
            description: 'Export your data or share your success.',
            exportData: {
                title: 'Export data',
                description: 'Download all your data as a JSON file'
            },
            shareSuccess: {
                title: 'Share success',
                description: 'Share your smoke-free time with others'
            },
            badge: {
                title: 'Create success badge',
                description: 'Create a badge with your statistics'
            },
            shareImage: {
                title: 'Share as image',
                description: 'Create an image for Instagram, WhatsApp & more'
            },
            pdf: {
                title: 'Create PDF report',
                description: 'Export your statistics as a PDF document'
            }
        },
        // Danger zone (HTML data-i18n keys)
        danger: {
            title: '⚠️ Danger zone',
            warning: 'This action cannot be undone!',
            deleteAccount: 'Delete account'
        },
        // Legacy keys
        accountInfo: 'Account Info',
        username: 'Username',
        email: 'Email',
        memberSince: 'Member since',
        quitSettings: 'Quit Settings',
        quitDate: 'Quit date',
        cigarettesPerDay: 'Cigarettes per day',
        pricePerPack: 'Price per pack (€)',
        cigarettesPerPack: 'Cigarettes per pack',
        save: 'Save',
        saving: 'Saving...',
        saveSuccess: 'Data saved successfully! The page will reload.',
        saveError: 'Error saving data: {message}',
        logoutError: 'Logout failed. Please try again.',
        cancel: 'Cancel',
        dataManagement: 'Data Management',
        exportData: 'Export data',
        exportDataDesc: 'Download all your data as a JSON file',
        shareSuccess: 'Share success',
        shareSuccessDesc: 'Share your progress with others',
        shareImage: 'Share as image',
        shareImageDesc: 'Create an image of your progress',
        deleteAccount: 'Delete account',
        deleteAccountDesc: 'Delete your account and all data',
        deleteConfirm: 'Are you sure? This action cannot be undone.'
    },

    // Data Export
    dataExport: {
        notLoggedIn: 'You must be logged in to export data.',
        exportSuccess: 'Your data has been downloaded successfully!',
        exportError: 'Error exporting data: {message}'
    },

    // Share
    share: {
        title: '📤 Share Success',
        close: 'Close',
        successText: '🎉 I have been smoke-free for {days} days!\n\n💰 Saved: {money}€\n🚭 Cigarettes avoided: {cigarettes}\n❤️ Life gained: {hours} hours\n\n#smokefree #byebyesmoke',
        copiedToClipboard: '📋 Text copied to clipboard!\n\nYou can now paste it in WhatsApp, Facebook, or wherever you like.',
        modalTitle: 'Share your success',
        creatingImage: 'Creating image...',
        imageText: '🎉 Check out my progress! #smokefree #byebyesmoke',
        imageError: 'Error creating image: {message}',
        imageDownloaded: '📸 Your success image has been downloaded!\n\nYou can now share it on Instagram, WhatsApp, Facebook, or wherever you like.',
        // Share modal buttons
        shareSuccess: {
            title: 'Share success',
            description: 'Share your smoke-free time with others'
        },
        badge: {
            title: 'Create success badge',
            description: 'Create a badge with your statistics'
        },
        shareImage: {
            title: 'Share as image',
            description: 'Create an image for Instagram, WhatsApp & more'
        },
        pdf: {
            title: 'Create PDF report',
            description: 'Export your statistics as a PDF document'
        }
    },

    // Badge
    badge: {
        smokeFree: 'Smoke-free!',
        anonymousHero: 'Anonymous Hero',
        days: 'Days',
        smokeFreeSub: 'smoke-free',
        daysSmokeFree: 'Days smoke-free',
        saved: 'saved',
        cigarettesAvoided: 'Cigarettes avoided',
        lifeGained: 'Life gained',
        lungHealth: 'Lung health',
        createdWith: 'Created with ByeByeSmoke',
        downloadSuccess: '🏆 Your success badge has been downloaded!\n\nYou can now use it as a profile picture, wallpaper, or for sharing.',
        createTitle: 'Create success badge',
        createDesc: 'Create a badge with your statistics'
    },

    // PDF Report
    pdf: {
        user: 'User',
        libraryLoading: 'PDF library is loading, please try again.',
        subtitle: 'Your Smoke-Free Report',
        createdFor: 'Created for',
        date: 'Date',
        daysSmokeFree: 'Days smoke-free',
        moneySaved: 'Money saved',
        cigarettesAvoided: 'Cigarettes avoided',
        lifeGained: 'Life gained',
        lungHealth: 'Lung health',
        timeSaved: 'Time saved',
        co2Avoided: 'CO2 avoided',
        environmentImpact: 'Environmental Impact',
        waterSaved: 'Water saved',
        liters: 'liters',
        treesSaved: 'Trees saved',
        footer: 'Created with ByeByeSmoke - byebyesmoke.de',
        downloadSuccess: '📄 Your PDF report has been created and downloaded!'
    },

    // Heatmap
    heatmap: {
        loading: 'Loading heatmap...',
        dataUnavailable: 'Heatmap data not available',
        noData: 'No craving data yet.',
        hint: 'Use the craving timer to track your cravings.',
        loadError: 'Error loading heatmap',
        cravings: 'cravings',
        less: 'Less',
        more: 'More',
        insights: 'Insights',
        total: 'Total',
        cravingsLast30Days: 'cravings in the last 30 days',
        peakDay: 'Highest cravings on <strong>{day}</strong>',
        peakTime: 'Critical time: <strong>{time}</strong>',
        noCravings: 'No cravings on <strong>{day}</strong> - well done!',
        notEnoughData: 'Not enough data for insights yet'
    },

    // Tutorial
    tutorial: {
        title: 'Welcome to ByeByeSmoke!',
        close: 'Close tutorial',
        srTitle: 'Tutorial',
        skip: 'Skip',
        next: 'Next',
        prev: 'Back',
        finish: 'Finish',
        // Navigation (HTML data-i18n keys)
        nav: {
            next: 'Next',
            prev: 'Back'
        },
        // Slide 1: Welcome
        slide1: {
            title: 'Welcome to ByeByeSmoke!',
            text: 'Let us show you the most important features and how to install the app as a PWA.',
            feature1: '📊 Track your progress',
            feature2: '🏥 Health milestones',
            feature3: '🆘 Help with cravings',
            feature4: '🔔 Push notifications',
            feature5: '📱 Install as app'
        },
        // Slide 2: Features
        slide2: {
            title: 'The 4 main areas',
            stats: {
                title: '📊 Dashboard',
                text: 'Your statistics at a glance'
            },
            milestones: {
                title: '🏥 Milestones',
                text: 'Track your health progress'
            },
            craving: {
                title: '🆘 SOS Help',
                text: '5-minute timer for cravings'
            },
            notifications: {
                title: '🔔 Notifications',
                text: 'Motivational push messages'
            }
        },
        // Slide 3: Install app
        slide3: {
            title: 'Install as App',
            step1: {
                title: 'iOS (Safari)',
                text: 'Tap "Share" → "Add to Home Screen"'
            },
            step2: {
                title: 'Android (Chrome)',
                text: 'Tap ⋮ → "Install app"'
            },
            step3: {
                title: 'Desktop',
                text: 'Click the install icon in the address bar'
            },
            note: 'After installation, the app behaves like a native app!'
        },
        // Slide 4: Tips
        slide4: {
            title: 'Tips for your success',
            warning: '💡 These tips help you through difficult moments:',
            step1: {
                title: '5-minute rule',
                text: 'Wait 5 minutes - the craving will pass!'
            },
            step2: {
                title: 'Drink water',
                text: 'A large glass of water helps immediately.'
            },
            step3: {
                title: 'Movement',
                text: 'Short walk or stretching.'
            },
            step4: {
                title: 'Breathing exercises',
                text: 'Use the integrated breathing exercises.'
            }
        },
        // Slide 5: Let's go
        slide5: {
            title: 'You are ready!',
            text: 'Every day without a cigarette is a success. We believe in you!',
            tipsTitle: 'Remember:',
            tip1: '💪 You are stronger than any craving',
            tip2: '📊 Use the app daily for motivation',
            tip3: '🆘 When craving: press the SOS button',
            tip4: '🎉 Celebrate every milestone!',
            finalMessage: 'Let\'s go - you can do this!'
        },
        // Legacy slides array
        slides: [
            {
                title: 'Your Companion',
                content: 'This app accompanies you on your path to a smoke-free life. Track your progress and stay motivated!'
            },
            {
                title: 'Dashboard',
                content: 'The dashboard shows all important statistics at a glance: saved time, money, and your health progress.'
            },
            {
                title: 'Milestones',
                content: 'Celebrate every success! Your body recovers continuously - here you can see exactly what\'s happening.'
            },
            {
                title: 'SOS Help',
                content: 'For acute cravings, the craving timer helps with breathing exercises and distraction games.'
            },
            {
                title: 'Let\'s go!',
                content: 'You\'re ready! Every day without a cigarette is a success. We believe in you!'
            }
        ]
    },

    // Weekly summary
    weeklySummary: {
        title: 'Weekly Review',
        thisWeek: 'This week',
        daysSmokeFree: 'Days smoke-free',
        moneySaved: 'saved',
        cigarettesAvoided: 'Cigarettes avoided',
        cravingsOvercome: 'Cravings overcome',
        keepGoing: 'Keep going!'
    },

    // Footer
    footer: {
        madeWith: 'Made with heart for your health',
        about: 'About ByeByeSmoke',
        privacy: 'Privacy',
        imprint: 'Imprint',
        sources: 'Sources',
        disclaimer: 'Not a substitute for medical advice.'
    },

    // Time units
    time: {
        second: 'second',
        seconds: 'seconds',
        minute: 'minute',
        minutes: 'minutes',
        hour: 'hour',
        hours: 'hours',
        hoursShort: '{count} hrs',
        day: 'day',
        days: '{count} days',
        week: 'week',
        weeks: '{count} weeks',
        month: 'month',
        months: '{count} months',
        year: 'year',
        years: '{count} years',
        remaining: '{time} remaining',
        ago: '{time} ago',
        in: 'in {time}',
        dayNamesShort: {
            sunday: 'Sun',
            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri',
            saturday: 'Sat'
        }
    },

    // Common
    common: {
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        cancel: 'Cancel',
        save: 'Save',
        close: 'Close',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        of: 'of'
    },

    // Auth
    auth: {
        login: 'Log in',
        register: 'Register',
        logout: 'Log out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        forgotPassword: 'Forgot password?',
        noAccount: 'No account yet?',
        hasAccount: 'Already registered?',
        loginError: 'Login failed',
        registerError: 'Registration failed',
        tryDemo: 'Try demo'
    },

    // Milestones data (translations for milestone items)
    milestonesData: {
        '20min': {
            title: '20 Minutes',
            description: 'Heart rate and blood pressure normalize',
            detailedInfo: 'After just 20 minutes, your body begins to recover. Your heart rate and blood pressure drop to more normal levels. Blood circulation in your hands and feet improves noticeably - they become warmer. This is the beginning of a long healing process that you have successfully started.'
        },
        '1hour': {
            title: '1 Hour',
            description: 'Body begins to break down nicotine',
            detailedInfo: 'After one hour, your body has already begun to actively break down the nicotine. The nicotine receptors in your brain are starting to normalize. Your body is starting the detoxification process and the first positive changes are already underway.'
        },
        '2hours': {
            title: '2 Hours',
            description: 'Nicotine withdrawal may begin, but body is recovering',
            detailedInfo: 'First withdrawal symptoms may now occur - this is a good sign! It shows that your body no longer has the nicotine and needs to adjust. At the same time, your circulatory system is already working more efficiently. Your peripheral nerve endings are beginning to recover.'
        },
        '8hours': {
            title: '8 Hours',
            description: 'Oxygen levels in blood normalize',
            detailedInfo: 'An important milestone! The oxygen level in your blood has normalized and the dangerous carbon monoxide continues to be broken down. Your organs are now better supplied with oxygen. You\'ll notice that exertion becomes a little easier. The risk of heart problems is starting to decrease.'
        },
        '12hours': {
            title: '12 Hours',
            description: 'Carbon monoxide levels in blood drop to normal',
            detailedInfo: 'Great! The toxic carbon monoxide has now almost completely disappeared from your blood. Your blood can now optimally transport oxygen again. Your organs, especially heart and brain, benefit from the improved oxygen supply. You\'re literally breathing easier!'
        },
        '24hours': {
            title: '24 Hours',
            description: 'Heart attack risk begins to decrease',
            detailedInfo: 'A whole day done - your heart attack risk is already starting to decrease! Your cardiovascular system is recovering noticeably. Blood pressure continues to stabilize and your heart works more efficiently. The acute stress from smoking is over. This is a significant step for your long-term heart health.'
        },
        '2days': {
            title: '2 Days',
            description: 'Sense of smell and taste improve significantly',
            detailedInfo: 'The nerve endings in your nose and mouth are beginning to regenerate. You\'ll perceive smells and tastes more intensely again - food tastes better, scents become clearer. The senses dulled by smoking are coming back to life. Many ex-smokers report this as one of the most motivating effects!'
        },
        '3days': {
            title: '3 Days',
            description: 'Nicotine completely out of body, breathing becomes easier',
            detailedInfo: 'Milestone reached! Nicotine has now completely disappeared from your body. The bronchi begin to relax and open - breathing becomes noticeably easier. Your lung capacity is already improving. Physical dependence is at its peak, but from now on it will continuously improve. You\'ve made it through the worst!'
        },
        '5days': {
            title: '5 Days',
            description: 'Physical nicotine withdrawal symptoms subside',
            detailedInfo: 'The most intense withdrawal symptoms are subsiding. Your body is getting used to life without nicotine. The dopamine receptors in your brain are beginning to normalize. Many report a feeling of clarity and more energy. The coughing urge may increase - this is positive because your lungs are beginning to cleanse themselves.'
        },
        '1week': {
            title: '1 Week',
            description: 'Bronchi begin to recover',
            detailedInfo: 'One week smoke-free - a great success! Your bronchi are actively beginning to heal. The inflammation caused by smoking is receding. You can breathe deeper and may cough more - a sign that your lungs are transporting away accumulated mucus. Your energy level rises noticeably.'
        },
        '10days': {
            title: '10 Days',
            description: 'Cilia in lungs regenerate',
            detailedInfo: 'The cilia in your airways, which were paralyzed by smoking, are beginning to regenerate. They can now fulfill their important function again: transporting mucus and pollutants out of the lungs. This is a crucial step for your lung health and infection defense.'
        },
        '2weeks': {
            title: '2 Weeks',
            description: 'Circulation and lung function improve noticeably',
            detailedInfo: 'Two weeks - your body has already made enormous progress! Your circulation works much better, climbing stairs becomes easier. Lung function continues to improve. Exercise becomes increasingly pleasant. Many ex-smokers report better sleep and more endurance in daily life. Psychological dependence is weakening.'
        },
        '3weeks': {
            title: '3 Weeks',
            description: 'Physical dependence is overcome',
            detailedInfo: 'An important psychological and physical milestone! Physical nicotine dependence is largely overcome. Your body no longer craves nicotine. The challenge is now primarily psychological - habits and triggers. But your body is free! Dopamine production is normalizing. You feel more genuine joy in life.'
        },
        '1month': {
            title: '1 Month',
            description: 'Lung capacity increases by up to 30%',
            detailedInfo: 'A whole month - fantastic! Your lung capacity has increased by up to 30%. You can breathe significantly deeper and have more endurance. The cilia in your lungs are working effectively again and protecting you better from infections. Coughing and shortness of breath have noticeably decreased. Your immune system is already stronger.'
        },
        '2months': {
            title: '2 Months',
            description: 'Skin appearance improves significantly',
            detailedInfo: 'Your skin is recovering! Blood circulation in the skin has normalized, leading to a fresher, healthier appearance. Wrinkles may smooth out somewhat, complexion becomes more even. Skin aging is slowing down. Many report a more youthful appearance. Wound healing also improves significantly.'
        },
        '3months': {
            title: '3 Months',
            description: 'Lung function improves by up to 10%',
            detailedInfo: 'Three months smoke-free - an enormous success! Lung function has improved by up to 10% and continues to improve. Coughing and shortness of breath are increasingly a thing of the past. Infection risk has decreased. Physical activities become significantly easier. Psychological dependence has greatly decreased. You\'ve really done it!'
        },
        '4months': {
            title: '4 Months',
            description: 'Immune system is significantly strengthened',
            detailedInfo: 'Your immune system is working at a higher level again. You\'ll get sick less often and recover faster from infections. White blood cells are functioning optimally again. Your overall resistance to disease has significantly increased. Your cells\' energy supply has normalized.'
        },
        '5months': {
            title: '5 Months',
            description: 'Endurance and resilience greatly improved',
            detailedInfo: 'Your physical performance is at a new level! Endurance and resilience have massively improved. Exercise is fun again. Stairs are no problem anymore. Your cardiovascular system is working efficiently. Oxygen uptake is significantly better. You feel fitter and more vital than in a long time.'
        },
        '6months': {
            title: '6 Months',
            description: 'Coughing and shortness of breath decrease significantly',
            detailedInfo: 'Half a year smoke-free - incredible! The chronic smoker\'s cough is largely gone. Shortness of breath is a thing of the past. Your lungs have regained most of their function. The cilia are working normally again and protecting you effectively. The risk of respiratory infections has significantly decreased. You\'re breathing freely!'
        },
        '9months': {
            title: '9 Months',
            description: 'Cilia fully regenerated',
            detailedInfo: 'The cilia in your airways are fully regenerated! They can now exercise their full protective function again. The lungs can effectively transport away mucus and particles. Your susceptibility to respiratory infections is at non-smoker levels. Your lungs\' self-cleaning power is restored. A medical milestone!'
        },
        '1year': {
            title: '1 Year',
            description: 'Heart attack risk is half that of smokers',
            detailedInfo: 'A whole year smoke-free - you\'re a champion! Your heart attack risk has halved compared to a smoker. Blood vessels have recovered, calcification is receding. Your heart works more efficiently and is less burdened. Stroke risk is also decreasing significantly. This is a huge step for your long-term health and life expectancy!'
        },
        '18months': {
            title: '18 Months',
            description: 'Lung function nearly normalized',
            detailedInfo: 'Your lung function has nearly completely normalized! Your lungs\' performance almost matches that of a non-smoker. Structural damage continues to heal. The alveoli have partially regenerated. Your breathing capacity has significantly increased. Peak athletic performance is possible again.'
        },
        '2years': {
            title: '2 Years',
            description: 'Cardiovascular system significantly recovered',
            detailedInfo: 'Two years smoke-free - impressive! Your cardiovascular system has recovered significantly. Vessel walls are more elastic, circulation is optimal. Risk of coronary heart disease continues to decrease. Blood pressure and pulse have permanently normalized. Your heart\'s resilience has significantly improved. Your quality of life and life expectancy have risen considerably.'
        },
        '3years': {
            title: '3 Years',
            description: 'Heart disease risk significantly reduced',
            detailedInfo: 'Three years - a great milestone! Your risk of heart disease has closely approached that of a non-smoker. Coronary arteries are significantly healthier. Vascular deposits (arteriosclerosis) are being broken down. Heart muscle supply is optimal. Risk of cardiac arrhythmias has decreased. Your heart has become significantly younger!'
        },
        '5years': {
            title: '5 Years',
            description: 'Stroke risk same as non-smokers',
            detailedInfo: 'Five years smoke-free - an incredible achievement! Your stroke risk is now at the same level as people who never smoked. Blood vessels in the brain are healthy. Risk of heart disease has continued to decrease significantly. Risk of various cancers has also substantially decreased. You\'ve given yourself years of additional life!'
        },
        '10years': {
            title: '10 Years',
            description: 'Lung cancer risk halves',
            detailedInfo: 'Ten years smoke-free - you\'re an absolute legend! Your lung cancer risk has halved compared to someone who continued smoking. Risk of other cancers (mouth, throat, esophagus, pancreas, bladder) has also significantly decreased. Your lungs have regenerated to the maximum extent. Life expectancy has risen considerably. You\'ve undergone an unprecedented health transformation!'
        },
        '15years': {
            title: '15 Years',
            description: 'Heart disease risk same as non-smokers',
            detailedInfo: 'Fifteen years smoke-free - unimaginably great! Your risk of coronary heart disease now equals that of a lifelong non-smoker. Your cardiovascular system has fully recovered. The damage caused by smoking has been largely reversed. Your health and life expectancy have improved dramatically. You\'re a shining example of the power of decision!'
        },
        '20years': {
            title: '20 Years',
            description: 'Health risks nearly like lifelong non-smokers',
            detailedInfo: 'Twenty years smoke-free - you\'ve made history! Your health risks are now nearly identical to those of people who never smoked. Most of the damage caused by smoking has been completely healed. Your body has undergone a complete transformation. You\'ve given yourself decades of additional, healthy life. This is the ultimate triumph over addiction and a testament to human willpower and regenerative ability!'
        }
    },

    // Achievements data
    achievements: {
        // Time-based
        first_hour: { title: 'First Hour', description: '60 minutes strong!' },
        first_day: { title: 'First Day', description: '24 hours smoke-free' },
        two_days: { title: 'Two Days', description: '48 hours done' },
        three_days: { title: 'Breakthrough', description: '3 days done' },
        five_days: { title: 'Five Days', description: 'Almost a week!' },
        one_week: { title: 'One Week', description: '7 days strong' },
        ten_days: { title: 'Ten Days', description: 'Double digits!' },
        two_weeks: { title: 'Two Weeks', description: '14 days free' },
        three_weeks: { title: 'Three Weeks', description: '21 days of power' },
        one_month: { title: 'One Month', description: '30 days of success' },
        forty_days: { title: 'Forty Days', description: 'Fantastic!' },
        fifty_days: { title: 'Champion', description: '50 days through' },
        two_months: { title: 'Two Months', description: '60 days strong' },
        seventy_days: { title: 'Seventy Days', description: 'Unstoppable!' },
        three_months: { title: 'Three Months', description: '90 days of freedom' },
        hundred_days: { title: 'Hundred Days', description: '100 days of freedom' },
        four_months: { title: 'Four Months', description: '120 days strong' },
        five_months: { title: 'Five Months', description: '150 days through' },
        six_months: { title: 'Half Year', description: '6 months strong' },
        seven_months: { title: 'Seven Months', description: '210 days of success' },
        nine_months: { title: 'Nine Months', description: '270 days free' },
        ten_months: { title: 'Ten Months', description: '300 days of power' },
        one_year: { title: 'One Year', description: '365 days of success' },
        five_hundred: { title: 'Five Hundred', description: '500 days legend' },
        two_years: { title: 'Two Years', description: '730 days free' },
        thousand: { title: 'Thousand Days', description: 'Absolute legend!' },
        three_years: { title: 'Three Years', description: '1095 days strong' },
        five_years: { title: 'Five Years', description: '1825 days master' },
        ten_years: { title: 'Ten Years', description: 'Absolute icon!' },

        // Money-based
        save_50: { title: 'First €50', description: '€50 saved' },
        save_100: { title: 'Hundred Euros', description: '€100 saved' },
        save_250: { title: 'Quarter Grand', description: '€250 saved' },
        save_500: { title: 'Saver', description: '€500 saved' },
        save_750: { title: 'Three Quarters', description: '€750 saved' },
        save_1000: { title: 'Money Magnet', description: '€1000 saved' },
        save_1500: { title: 'Piggy Bank', description: '€1500 saved' },
        save_2000: { title: 'Two Thousand', description: '€2000 saved' },
        save_3000: { title: 'Wealth Builder', description: '€3000 saved' },
        save_5000: { title: 'Five Thousand', description: '€5000 saved' },
        save_10000: { title: 'Ten Thousand', description: '€10000 saved!' },

        // Cigarettes-based
        cigs_10: { title: 'First Ten', description: '10 not smoked' },
        cigs_50: { title: 'Fifty Gone', description: '50 not smoked' },
        cigs_100: { title: 'Counter', description: '100 not smoked' },
        cigs_250: { title: 'Quarter Pack', description: '250 not smoked' },
        cigs_500: { title: 'Five Hundred', description: '500 not smoked' },
        cigs_1000: { title: 'Master', description: '1000 not smoked' },
        cigs_2000: { title: 'Two Thousand', description: '2000 not smoked' },
        cigs_5000: { title: 'Five Thousand', description: '5000 not smoked' },
        cigs_10000: { title: 'Ten Thousand', description: '10000 not smoked!' },

        // Life hours
        life_1h: { title: 'First Hour', description: '1 hour of life gained' },
        life_12h: { title: 'Half Day', description: '12 hours of life gained' },
        life_24h: { title: 'One Day of Life', description: '24 hours of life gained' },
        life_48h: { title: 'Two Days of Life', description: '48 hours of life gained' },
        life_100h: { title: 'Hundred Hours', description: '100 hours of life gained' },
        life_1w: { title: 'One Week of Life', description: '168 hours of life gained' },
        life_500h: { title: 'Five Hundred Hours', description: '500 hours of life gained' },
        life_1000h: { title: 'Thousand Hours', description: '1000 hours of life gained' },

        // Lung health
        lung_5: { title: 'First Recovery', description: '5% lung health' },
        lung_10: { title: 'Breathe Easy', description: '10% lung health' },
        lung_25: { title: 'Quarter Way', description: '25% lung health' },
        lung_50: { title: 'Halfway', description: '50% lung health' },
        lung_75: { title: 'Almost There', description: '75% lung health' },
        lung_90: { title: 'Mountain Air', description: '90% lung health' },

        // Water saved
        water_100: { title: 'First Drops', description: '100 liters of water saved' },
        water_500: { title: 'Shower Saved', description: '500 liters of water saved' },
        water_1000: { title: 'Bathtub Full', description: '1000 liters of water saved' },
        water_5000: { title: 'Small Pool', description: '5000 liters of water saved' },
        water_10000: { title: 'Water Hero', description: '10000 liters of water saved' },

        // CO2
        co2_1: { title: 'Green Start', description: '1 kg CO₂ avoided' },
        co2_5: { title: 'Tree Caretaker', description: '5 kg CO₂ avoided' },
        co2_10: { title: 'Forest Friend', description: '10 kg CO₂ avoided' },
        co2_25: { title: 'Nature Protector', description: '25 kg CO₂ avoided' },
        co2_50: { title: 'Climate Hero', description: '50 kg CO₂ avoided' },
        co2_100: { title: 'Earth Guardian', description: '100 kg CO₂ avoided' },

        // Time saved
        time_10h: { title: 'Ten Hours', description: '10 hours of time saved' },
        time_24h: { title: 'One Day of Time', description: '24 hours of time saved' },
        time_50h: { title: 'Fifty Hours', description: '50 hours of time saved' },
        time_100h: { title: 'Hundred Hours', description: '100 hours of time saved' },
        time_168h: { title: 'One Week of Time', description: '168 hours of time saved' },
        time_500h: { title: 'Five Hundred Hours', description: '500 hours of time saved' }
    },

    // Motivations
    motivations: [
        "Every day without a cigarette is a victory for your health!",
        "Your body thanks you for every smoke-free day. You can do this!",
        "The first days are the hardest - and you\'re mastering them!",
        "With each day you become stronger and healthier. Keep it up!",
        "Your lungs are cleaning themselves a little more each day.",
        "You\'re investing in your life and your future. Fantastic!",
        "Every cigarette not smoked is time you\'re adding to your life.",
        "You\'re stronger than the addiction. Prove it to yourself!",
        "Your sense of smell and taste are returning. Enjoy it!",
        "Proud of you! You\'re consistently walking your path.",
        "Your heart beats healthier with every smoke-free day.",
        "Freedom from addiction is priceless. You\'re achieving it!",
        "Remember: The craving passes, but your pride stays!",
        "You\'re a role model for others! Stay strong!",
        "Every smoke-free breath is a gift to yourself."
    ],

    // Quit statistics
    quitStatistics: {
        day1: '85% give up in the first 24 hours',
        day3: '90% don\'t make it past the first 3 days',
        week1: '95% fail in the first week',
        month1: '97% give up in the first month',
        month3: 'Only 2% make it to 3 months',
        month6: 'Only 1% reach 6 months',
        year1: 'You\'re in the top 0.5%!'
    },

    // Landing page
    landing: {
        hero: {
            title: 'Become smoke-free.',
            titleHighlight: 'Forever.',
            subtitle: 'The free app that accompanies you on your quit journey. Science-based, ad-free, no hidden costs.',
            cta: 'Start now',
            demo: 'Or try it first'
        },
        features: {
            title: 'Everything you need',
            subtitle: 'Science-based features for your success',
            healthTracking: {
                title: 'Health Tracking',
                description: 'Track how your body recovers day by day'
            },
            savings: {
                title: 'Savings Calculator',
                description: 'See how much money you\'ve already saved'
            },
            milestones: {
                title: 'Milestones',
                description: '28 scientific health milestones'
            },
            sosHelp: {
                title: 'SOS Help',
                description: 'Breathing exercises and games against acute cravings'
            },
            statistics: {
                title: 'Detailed Statistics',
                description: 'Health score and progress analyses'
            },
            privacy: {
                title: 'Privacy',
                description: 'Your data belongs to you. No ads, no tracking.'
            },
            offline: {
                title: 'Works Offline',
                description: 'Functions even without internet connection'
            },
            free: {
                title: '100% Free',
                description: 'No hidden costs, no premium version'
            }
        },
        howItWorks: {
            title: 'How it works',
            step1: {
                title: 'Register',
                description: 'Create a free account'
            },
            step2: {
                title: 'Set up',
                description: 'Enter your quit date and smoking habits'
            },
            step3: {
                title: 'Stay strong',
                description: 'Track your progress and stay motivated'
            }
        },
        stats: {
            title: 'Did you know?',
            cigarettesPerYear: 'Cigarettes an average smoker smokes per year',
            costPerYear: 'A smoker spends on average per year',
            lifeYearsLost: 'Years of life a smoker loses on average'
        },
        cta: {
            title: 'Ready for your smoke-free life?',
            subtitle: 'Thousands have done it. You can too.',
            button: 'Start for free'
        },
        footer: {
            privacy: 'Privacy',
            imprint: 'Imprint',
            sources: 'Sources',
            github: 'GitHub'
        }
    },

    // Notifications
    notifications: {
        enableNotifications: 'Enable notifications',
        alerts: {
            notSupported: 'Your browser does not support push notifications.',
            blocked: 'You have blocked notifications. Please enable them in your browser settings.'
        },
        milestoneReached: 'Milestone reached!',
        dailyMotivation: 'Daily motivation',
        motivation: {
            success: 'Every smoke-free day is a success!',
            stronger: 'You are stronger than your craving!',
            health: 'Your health thanks you!',
            easier: 'Keep going - it gets easier every day!',
            future: 'You are investing in your future!',
            proud: 'Proud of you - keep it up!',
            lungs: 'Your lungs are regenerating more every day!',
            roleModel: 'You are a role model for others!',
            freedom: 'Freedom instead of addiction - you can do it!'
        },
        testSuccess: 'Notifications are working!'
    },

    // Mini Games
    miniGames: {
        title: 'Distraction Games',
        intro: 'Distract yourself for a few minutes!',
        tap: {
            description: 'Tap the targets!',
            fullDesc: 'Tap the targets as fast as you can!',
            hint: 'Tap the circles!'
        },
        breathe: {
            title: 'Breath Trainer',
            desc: 'Follow the rhythm and breathe deeply.',
            instruction: 'Breathe in...',
            breaths: 'breaths',
            relaxed: 'Relaxed!',
            feelBetter: 'You took 5 deep breaths. Feel better?'
        },
        memory: {
            description: 'Find the pairs!',
            fullDesc: 'Find the matching pairs!',
            moves: 'Moves',
            found: 'Found'
        },
        labels: {
            points: 'Points',
            time: 'Time'
        },
        results: {
            incredible: 'Incredible! You are a pro!',
            veryGood: 'Very well done!',
            goodWork: 'Good work!',
            keepPracticing: 'Keep practicing!',
            perfect: 'Perfect! Amazing memory!',
            practiceMoreMemory: 'Practice makes perfect!'
        },
        done: 'Done!',
        playAgain: 'Play again',
        otherGames: 'Other games'
    },

    // Weekly Summary
    weeklySummary: {
        title: 'Your weekly summary',
        saved: 'saved',
        avoided: 'Cigarettes avoided',
        cravingsOvercome: 'Cravings overcome',
        totalDays: 'Days smoke-free total',
        message: 'Keep going - you are doing great!',
        button: 'Got it!'
    },

    // Progress Goals
    progressGoals: {
        saveGoals: 'Save goals',
        clickToEdit: 'Click to edit',
        days: 'Days',
        cigarettes: 'Cigarettes',
        editDaysGoal: 'Edit days goal',
        editMoneyGoal: 'Edit money goal',
        editCigarettesGoal: 'Edit cigarettes goal',
        newGoal: 'New goal:',
        cancel: 'Cancel',
        save: 'Save',
        invalidValue: 'Please enter a valid value between 1 and 100,000.'
    },

    // Breathing Exercises
    breathingExercises: {
        inhale: 'Breathe in',
        exhale: 'Breathe out',
        hold: 'Hold',
        cycle: 'Cycle {current} of {total}',
        done: 'Done!',
        completed: 'You have completed the exercise',
        box: {
            description: 'Even breathing for balance and focus',
            totalTime: '~2 minutes',
            benefits: 'Reduces stress, improves concentration'
        },
        '478': {
            name: '4-7-8 Technique',
            description: 'Calming breath for relaxation',
            totalTime: '~2.5 minutes',
            benefits: 'Helps with sleep, reduces anxiety'
        }
    },

    // Charts
    charts: {
        moneySaved: 'Money saved (€)',
        cigarettesNotSmoked: 'Cigarettes not smoked',
        euroAxis: 'Euro (€)',
        cigarettesAxis: 'Cigarettes'
    },

    // Craving Stats
    cravingStats: {
        trend: {
            decreasing: 'Trend: Decreasing',
            increasing: 'Trend: Increasing',
            stable: 'Trend: Stable'
        },
        todayOvercome: 'Overcome today',
        avgPerDay: 'Avg. per day (7 days)',
        total30Days: 'Total (30 days)',
        loadError: 'Could not load statistics.',
        chartLabel: 'Cravings overcome'
    },

    // Days of week (short)
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    // Months
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
