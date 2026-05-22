import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { addVideoToPlaylistApi, deleteVideoFromPlaylistApi } from '@/axiosFiles/playlistApi.js';
import { addVideoToPlaylistStore, deleteVideoFromPlaylistStore } from '@/store/playlistSlice.js';

function PlaylistModal({ videoId, onClose }) {
    const dispatch = useDispatch();

    // Grab all playlists r global Redux state
    const { userPlaylists } = useSelector((state) => state.playlist);


    const handleCheckboxChange = async (playlistId, isChecked) => {
        try {
            if (isChecked) {

                await addVideoToPlaylistApi({ playlistId, videoId });

                dispatch(addVideoToPlaylistStore({ playlistId, videoId }));
            } else {

                await deleteVideoFromPlaylistApi({ playlistId, videoId });

                dispatch(deleteVideoFromPlaylistStore({ playlistId, videoId }));
            }
        } catch (error) {
            console.error("Error toggling playlist video status:", error);
        }
    };

    return (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">


            <div className="bg-white w-72 rounded-xl shadow-xl p-4 animate-in zoom-in-95 duration-150">


                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-700">Save to...</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>


                <div className="space-y-2 max-h-40 overflow-y-auto mb-2 pr-1">
                    {userPlaylists.length > 0 ? (
                        userPlaylists.map((playlist) => {

                            const isChecked = playlist.videos?.includes(videoId);

                            return (
                                <label
                                    key={playlist._id}
                                    className="flex items-center gap-3 py-1.5 px-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked || false}
                                        onChange={(e) => handleCheckboxChange(playlist._id, e.target.checked)}
                                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
                                    />
                                    <span className="truncate flex-1">{playlist.name}</span>
                                </label>
                            );
                        })
                    ) : (
                        <p className="text-[11px] text-gray-400 italic py-2 text-center">
                            You haven't created any playlists yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlaylistModal;