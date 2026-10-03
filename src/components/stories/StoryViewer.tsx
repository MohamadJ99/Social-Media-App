"use client";

import Image from "next/image";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { useViewStory } from "@/hooks/stories/useViewStory";
import type {
    Story,
    StoryGroup,
} from "@/types/story";

type StoryViewerProps = {
    groups: StoryGroup[];
    initialGroupIndex: number;
    onClose: () => void;
};

const IMAGE_DURATION = 5000;

const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL;

const StoryViewer = ({
    groups,
    initialGroupIndex,
    onClose,
}: StoryViewerProps) => {
    const [groupIndex, setGroupIndex] =
        useState(initialGroupIndex);

    const [storyIndex, setStoryIndex] =
        useState(0);

    const [progress, setProgress] =
        useState(0);

    const [isPaused, setIsPaused] =
        useState(false);

    const [isMediaLoading, setIsMediaLoading] =
        useState(true);

    const [hasMediaError, setHasMediaError] =
        useState(false);

    const videoRef =
        useRef<HTMLVideoElement | null>(null);

    const imageElapsedRef = useRef(0);

    const { viewStory } = useViewStory();

    const currentGroup = groups[groupIndex];
    const currentStory =
        currentGroup?.stories[storyIndex];

    const goToNext = useCallback(() => {
        if (!currentGroup) {
            return;
        }

        setProgress(0);
        setIsPaused(false);
        setIsMediaLoading(true);
        setHasMediaError(false);
        imageElapsedRef.current = 0;

        const hasNextStory =
            storyIndex <
            currentGroup.stories.length - 1;

        if (hasNextStory) {
            setStoryIndex((current) => current + 1);
            return;
        }

        const hasNextGroup =
            groupIndex < groups.length - 1;

        if (hasNextGroup) {
            setGroupIndex((current) => current + 1);
            setStoryIndex(0);
            return;
        }

        onClose();
    }, [
        currentGroup,
        storyIndex,
        groupIndex,
        groups.length,
        onClose,
    ]);

    const goToPrevious = useCallback(() => {

        setProgress(0);
        setIsPaused(false);
        setIsMediaLoading(true);
        setHasMediaError(false);
        imageElapsedRef.current = 0;

        if (storyIndex > 0) {
            setStoryIndex((current) => current - 1);
            return;
        }

        if (groupIndex > 0) {
            const previousGroupIndex =
                groupIndex - 1;

            const previousGroup =
                groups[previousGroupIndex];

            setGroupIndex(previousGroupIndex);

            setStoryIndex(
                Math.max(
                    previousGroup.stories.length - 1,
                    0
                )
            );
        }
    }, [
        storyIndex,
        groupIndex,
        groups,
    ]);


    useEffect(() => {
        if (
            !currentStory ||
            currentGroup.is_current_user ||
            currentStory.is_viewed
        ) {
            return;
        }

        void viewStory(currentStory.id).catch(
            (error) => {
                console.error(
                    "Failed to mark story as viewed:",
                    error
                );
            }
        );
    }, [
        currentStory,
        currentGroup.is_current_user,
        viewStory,
    ]);

    useEffect(() => {
        if (
            !currentStory ||
            currentStory.media.type !== "image" ||
            isPaused ||
            isMediaLoading
        ) {
            return;
        }

        let lastTimestamp = performance.now();

        const interval = window.setInterval(() => {
            const now = performance.now();

            imageElapsedRef.current +=
                now - lastTimestamp;

            lastTimestamp = now;

            const nextProgress = Math.min(
                (imageElapsedRef.current /
                    IMAGE_DURATION) *
                100,
                100
            );

            setProgress(nextProgress);

            if (nextProgress >= 100) {
                window.clearInterval(interval);
                goToNext();
            }
        }, 50);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        currentStory,
        isPaused,
        isMediaLoading,
        goToNext,

    ]);

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "ArrowRight") {
                goToNext();
            }

            if (event.key === "ArrowLeft") {
                goToPrevious();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        goToNext,
        goToPrevious,
        onClose,
    ]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    if (!currentGroup || !currentStory) {
        return null;
    }

    const avatarUrl = currentGroup.user.avatar
        ? `${storageUrl}/${currentGroup.user.avatar}`
        : "/default-avatar.png";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            role="dialog"
            aria-modal="true"
            aria-label="Story viewer"
        >
            <div className="relative flex h-full w-full items-center justify-center md:h-[95vh] md:max-w-[500px]">
                <div
                    className="relative h-full w-full overflow-hidden bg-black md:rounded-xl"
                    onPointerDown={() => setIsPaused(true)}
                    onPointerUp={() => setIsPaused(false)}
                    onPointerCancel={() => setIsPaused(false)}
                    onPointerLeave={() => setIsPaused(false)}
                >
                    <StoryProgress
                        stories={currentGroup.stories}
                        currentIndex={storyIndex}
                        progress={progress}
                    />

                    <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pb-4 pt-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <Image
                                src={avatarUrl}
                                alt={currentGroup.user.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />

                            <div className="min-w-0 text-white">
                                <p className="truncate text-sm font-semibold">
                                    {currentGroup.user.name}
                                </p>

                                <p className="text-xs text-white/70">
                                    {formatStoryTime(
                                        currentStory.created_at
                                    )}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close stories"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white transition hover:bg-white/10"
                        >
                            ×
                        </button>
                    </div>

                    <StoryMedia
                        story={currentStory}
                        videoRef={videoRef}
                        isPaused={isPaused}
                        onProgress={setProgress}
                        onEnded={goToNext}
                        onMediaReady={() => setIsMediaLoading(false)}
                        onMediaError={() => {
                            setIsMediaLoading(false);
                            setHasMediaError(true);
                        }}
                    />

                    {isMediaLoading && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                            <div
                                className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
                                role="status"
                                aria-label="Loading story"
                            />
                        </div>
                    )}

                    {hasMediaError && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
                            <div className="px-6 text-center text-white">
                                <p className="text-lg font-semibold">
                                    Unable to load story
                                </p>

                                <p className="mt-2 text-sm text-white/60">
                                    This media could not be displayed.
                                </p>

                                <button
                                    type="button"
                                    onClick={goToNext}
                                    className="mt-5 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                                >
                                    Next story
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStory.caption && (
                        <div className="absolute bottom-8 left-4 right-4 z-20">
                            <p className="rounded-lg bg-black/40 px-4 py-3 text-center text-sm text-white backdrop-blur-sm">
                                {currentStory.caption}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={goToPrevious}
                        disabled={
                            groupIndex === 0 &&
                            storyIndex === 0
                        }
                        aria-label="Previous story"
                        className="absolute bottom-0 left-0 top-24 z-10 w-1/3 disabled:cursor-default"
                    />

                    <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Next story"
                        className="absolute bottom-0 right-0 top-24 z-10 w-1/3"
                    />
                </div>
            </div>
        </div>
    );
};

type StoryProgressProps = {
    stories: Story[];
    currentIndex: number;
    progress: number;
};

const StoryProgress = ({
    stories,
    currentIndex,
    progress,
}: StoryProgressProps) => {
    return (
        <div className="absolute left-3 right-3 top-3 z-30 flex gap-1">
            {stories.map((story, index) => {
                let width = 0;

                if (index < currentIndex) {
                    width = 100;
                }

                if (index === currentIndex) {
                    width = progress;
                }

                return (
                    <div
                        key={story.id}
                        className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                    >
                        <div
                            className="h-full bg-white"
                            style={{
                                width: `${width}%`,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

type StoryMediaProps = {
    story: Story;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isPaused: boolean;
    onProgress: (progress: number) => void;
    onEnded: () => void;
    onMediaReady: () => void;
    onMediaError: () => void;
};

const StoryMedia = ({
    story,
    videoRef,
    isPaused,
    onProgress,
    onMediaReady,
    onEnded,
    onMediaError
}: StoryMediaProps) => {

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        if (isPaused) {
            video.pause();
            return;
        }

        void video.play().catch(() => {
            // Autoplay may be blocked by the browser.
        });
    }, [isPaused, videoRef])

    if (story.media.type === "video") {
        return (
            <video
                ref={videoRef}
                src={story.media.url}
                autoPlay
                playsInline
                className="h-full w-full object-contain"
                onCanPlay={onMediaReady}
                onError={onMediaError}
                onTimeUpdate={(event) => {
                    const video = event.currentTarget;

                    if (!video.duration) {
                        return;
                    }

                    onProgress(
                        Math.min(
                            (video.currentTime /
                                video.duration) *
                            100,
                            100
                        )
                    );
                }}
                onEnded={onEnded}
            />
        );
    }

    return (
        <Image
            src={story.media.url}
            alt="Story"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
            onLoad={onMediaReady}
            onError={onMediaError}
        />
    );
};

const formatStoryTime = (
    createdAt: string
) => {
    const created = new Date(createdAt);
    const now = new Date();

    const difference =
        now.getTime() - created.getTime();

    const minutes = Math.floor(
        difference / 60_000
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours}h`;
};

export default StoryViewer;