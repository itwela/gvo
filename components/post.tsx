import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import FastImage from 'react-native-fast-image';
import { FontAwesome } from "@expo/vector-icons";
import { gvoColors } from "@/constants/Colors";
import { fontSizes } from "@/constants/Fontsizes";
import sql from '@/helpers/neonClient';
import { useEffect, useState } from "react";
import { useGVOContext } from "@/constants/gvoContext";

export default function Post({ id, image, username, created, content, likes }: { id: any, image: string, username: string, created: any, content: string, likes: number }) {
    

    const uid = "45531ae2-35cf-419d-b690-4a445401bcee"
    const {isPostLiked, setIsPostLiked} = useGVOContext();
    const {likedPostId, setLikedPostId} = useGVOContext();
    const {threads, setThreads} = useGVOContext();

    const checkPostLike = async () => {
        const result = await sql`SELECT * FROM post_likes WHERE user_id = ${uid} AND post_id = ${id}`;
        setIsPostLiked?.(result.length > 0);
        setLikedPostId?.(id);
    };

    const fetchThreads = async () => {
        const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
        setThreads?.(result);
        console.log(result);
    };

    useEffect(() => {
        checkPostLike();
    }, [isPostLiked]);

    useEffect(() => {
        fetchThreads();
    }, [threads]);

    const deletePost = async () => {
        console.log("delete post");
        const response = await sql`DELETE FROM posts WHERE id = ${id}`;
        console.log("deleted");
    }

    const likePost = async (userId: any, postId: any) => {
        try {
            console.log("like post");
            const updateLikeCount = await sql`UPDATE posts SET like_count = like_count + 1 WHERE id = ${id}`;
            // Insert a new like, ensuring the user can't like the same post twice
            const updateLikeTable = await sql`
                INSERT INTO post_likes (user_id, post_id)
                VALUES (${userId}, ${postId})
                ON CONFLICT (user_id, post_id) DO NOTHING
            `;
            console.log("liked");
            checkPostLike();
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const unlikePost = async (userId: any, postId: any) => {
        try {
            console.log("unlike post");
            const updateLikeCount = await sql`UPDATE posts SET like_count = like_count - 1 WHERE id = ${id}`;
            const deleteLike = await sql`DELETE FROM post_likes WHERE user_id = ${userId} AND post_id = ${postId}`;
            console.log("unliked");
            checkPostLike();
        } catch (error) {
            console.error("Error unliking post:", error);
        }
    };
    
    return (
        <>
              <View style={styles.thread}>
                  <View style={styles.threadbox}>
                      <View style={{width: "10%", height: "100%",}}>
                          <View style={styles.personImage}>
                            <FastImage source={{ uri: image }} style={{width: "100%", height: "100%", borderRadius: 100}} />
                          </View>
                      </View>
                      <View style={{width: "90%", height: "100%", display: "flex", flexDirection: "column"}}>
                          <View style={{display: "flex", justifyContent: "space-between", flexDirection: "row", gap: 5}}>
                            <View style={{display: "flex", flexDirection: "row", gap: 5}}>
                                <Text style={styles.personName}>{username}</Text>
                                <Text style={styles.time}>
                                    {(() => {
                                    const createdAt = new Date(created);
                                    const now = new Date();
                                    const diffInMs = now.getTime() - createdAt.getTime();
                                    const diffInMinutes = Math.floor(Math.abs(diffInMs) / (1000 * 60));
                                    const diffInHours = Math.floor(diffInMinutes / 60);
                                    const diffInDays = Math.floor(diffInHours / 24);
                                    const diffInWeeks = Math.floor(diffInDays / 7);

                                    if (diffInWeeks >= 1) {
                                        return `${diffInWeeks}w ago`;
                                    } else if (diffInDays >= 1) {
                                        return `${diffInDays}d ago`;
                                    } else if (diffInHours >= 1) {
                                        return `${diffInHours}h ago`;
                                    } else {
                                        return `${diffInMinutes}m ago`;
                                    }
                                    })()}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => {deletePost()}} activeOpacity={0.9}>
                              <FontAwesome name="trash" size={15} color={gvoColors.semidark} style={{paddingRight: 20}}/>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.personText}>{content}</Text>
                          <View style={{display: "flex", flexDirection: "row", paddingVertical: 10}}>
                              <TouchableOpacity onPress={() => {isPostLiked ? unlikePost(uid, id) : likePost(uid, id)}} activeOpacity={0.9}>
                                <FontAwesome name={isPostLiked ? "heart" : "heart-o"} size={15} color={isPostLiked ? gvoColors.azure : gvoColors.dutchWhite} style={{marginRight: 5}}/>
                              </TouchableOpacity>
                              <Text style={{color: isPostLiked ? gvoColors.azure : gvoColors.dutchWhite}}>{likes}</Text>
                          </View>
                      </View>
                  </View>
              </View>  
        </>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
      opacity: 0
    },
    roomText: {
      fontSize: fontSizes.medium,
      fontWeight: "bold",
      color: gvoColors.dutchWhite
    },
    roomContainer: {
      borderRadius: 10,
      padding: 5,
      minHeight: 100,
    },
    roomHeader: {
      backgroundColor: gvoColors.emerald,
      borderRadius: 10,
      padding: 5,
    },
    thread: {
      width: "100%",
      height: 100,
      borderBottomWidth: 1,
      borderColor: gvoColors.semidark,
      marginBottom: 10
    },
    threadbox: {
      width: "100%",
      height: "100%",
      paddingHorizontal: 20,
      paddingVertical: 10,
      display: "flex",
      flexDirection: "row",
      gap: 20
    },
    personName: {
        fontSize: fontSizes.small + 1,
        fontWeight: "bold",
        color: gvoColors.azure
    },
    personText: {
        fontSize: fontSizes.small,
        color: gvoColors.dutchWhite
    },
    personImage: {
        width: 35,
        height: 35,
        borderRadius: 50
    },
    time: {
        fontSize: fontSizes.small,
        color: gvoColors.dutchWhite,
        opacity: 0.5
    }
  });