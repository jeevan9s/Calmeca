import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Clock, FileText, Plus, Check, Trash2 } from 'lucide-react';
import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { 
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    CreateLink,
    InsertThematicBreak,
    ListsToggle,
    BlockTypeSelect
} from '@mdxeditor/editor';

import { getTaskById, updateTask } from '../../../services/core services/taskService';
import { createSubTask, getSubTasksByTask, toggleSubTaskCompletion, deleteSubTask } from '../../../services/core services/subtaskService';
import { getCourseById } from '../../../services/core services/courseService';
import SubtaskComponent from '../../components/SubtaskComponent';
import { Task } from '../../../services/db';
import type { SubTask, Course } from '../../../services/db';

export default function TaskHomepage() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [subtasks, setSubtasks] = useState<SubTask[]>([]);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [showAddSubtask, setShowAddSubtask] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    useEffect(() => {
        loadTaskData();
    }, [taskId]);

    const loadTaskData = async () => {
        if (!taskId) return;
        
        try {
            setIsLoading(true);
            const taskData = await getTaskById(taskId);
            if (taskData) {
                setTask(taskData);
                setNotes(taskData.notes || '');
                
                // Load course data
                const courseData = await getCourseById(taskData.courseId);
                setCourse(courseData || null);
                
                // Load subtasks
                const subtaskData = await getSubTasksByTask(taskId);
                setSubtasks(subtaskData);
            }
        } catch (error) {
            console.error('Error loading task data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotesChange = async (markdown: string) => {
        setNotes(markdown);
        if (!task) return;

        try {
            setIsSavingNotes(true);
            await updateTask(task.id, { notes: markdown });
        } catch (error) {
            console.error('Error saving notes:', error);
        } finally {
            setIsSavingNotes(false);
        }
    };

    const handleAddSubtask = async () => {
        if (!newSubtaskTitle.trim() || !taskId || !task) return;

        try {
            await createSubTask({
                taskId,
                courseId: task.courseId,
                title: newSubtaskTitle.trim(),
                completed: false
            });
            
            setNewSubtaskTitle('');
            setShowAddSubtask(false);
            await loadTaskData(); // Reload subtasks
        } catch (error) {
            console.error('Error creating subtask:', error);
        }
    };

    const handleToggleTask = async () => {
        if (!task) return;
        
        try {
            await updateTask(task.id, { completed: !task.completed });
            setTask({ ...task, completed: !task.completed });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Task Not Found</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-500 flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </button>
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={handleToggleTask}
                                    className="transition-colors"
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                                <h1 className={`text-3xl font-bold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                    {task.title}
                                </h1>
                            </div>
                            
                            {course && (
                                <div className="flex items-center gap-2 mb-2">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: course.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {course.title}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(task.deadline)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {task.type}
                                </div>
                            </div>
                            
                            {task.description && (
                                <p className="text-gray-700 dark:text-gray-300 mt-3">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Notes Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Notes
                            </h2>
                            {isSavingNotes && (
                                <span className="text-sm text-gray-500">Saving...</span>
                            )}
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <MDXEditor
                                markdown={notes}
                                onChange={handleNotesChange}
                                plugins={[
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    markdownShortcutPlugin(),
                                    toolbarPlugin({
                                        toolbarContents: () => (
                                            <>
                                                <UndoRedo />
                                                <BoldItalicUnderlineToggles />
                                                <CreateLink />
                                                <InsertThematicBreak />
                                                <BlockTypeSelect />
                                                <ListsToggle />
                                            </>
                                        )
                                    })
                                ]}
                                contentEditableClassName="min-h-[300px] p-4 prose prose-sm dark:prose-invert max-w-none focus:outline-none"
                                placeholder="Start taking notes for this task..."
                            />
                        </div>
                    </motion.div>

                    {/* Subtasks Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Subtasks ({subtasks.length})
                            </h2>
                            <button
                                onClick={() => setShowAddSubtask(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add Subtask
                            </button>
                        </div>

                        <AnimatePresence>
                            {showAddSubtask && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                                >
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSubtaskTitle}
                                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                            placeholder="Enter subtask title..."
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddSubtask();
                                                } else if (e.key === 'Escape') {
                                                    setShowAddSubtask(false);
                                                    setNewSubtaskTitle('');
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAddSubtask}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddSubtask(false);
                                                setNewSubtaskTitle('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            {subtasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="text-lg mb-2">No subtasks yet</div>
                                    <div className="text-sm">Break down this task into smaller steps</div>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {subtasks.map((subtask) => (
                                        <motion.div
                                            key={subtask.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={async () => {
                                                        await toggleSubTaskCompletion(subtask.id);
                                                        loadTaskData();
                                                    }}
                                                    className="transition-colors"
                                                >
                                                    {subtask.completed ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <div className="h-4 w-4 rounded border border-gray-400 hover:border-gray-600" />
                                                    )}
                                                </button>
                                                <span className={`flex-1 ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                    {subtask.title}
                                                </span>
                                                <button
                                                    onClick={async () => {
                                                        await deleteSubTask(subtask.id);
                                                        loadTaskData();
                                                    }}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}