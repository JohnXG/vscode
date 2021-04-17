/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { ITextBufferFactory, ITextSnapshot } from 'vs/editor/common/model';
import { CancellationToken } from 'vs/base/common/cancellation';
import { IWorkingCopyIdentifier } from 'vs/workbench/services/workingCopy/common/workingCopyService';

export const IWorkingCopyBackupService = createDecorator<IWorkingCopyBackupService>('workingCopyBackupService');

/**
 * Working copy backup metadata that can be associated
 * with the backup.
 *
 * Some properties may be reserved as outlined here and
 * cannot be used.
 */
export interface IWorkingCopyBackupMeta {
	[key: string]: unknown;
	typeId?: never;
}

/**
 * A resolved working copy backup carries the backup value
 * as well as associated metadata with it.
 */
export interface IResolvedWorkingCopyBackup<T extends IWorkingCopyBackupMeta> {

	/**
	 * The actual backed up value of the entity.
	 */
	readonly value: ITextBufferFactory;

	/**
	 * Additional metadata that is associated with
	 * the entity.
	 */
	readonly meta?: T;
}

/**
 * The working copy backup service is the main service to handle backups
 * for working copies.
 * Methods allow to persist and resolve working copy backups from the file
 * system.
 */
export interface IWorkingCopyBackupService {

	readonly _serviceBrand: undefined;

	/**
	 * Finds out if there are any working copy backups stored.
	 */
	hasBackups(): Promise<boolean>;

	/**
	 * Finds out if a working copy backup with the given identifier
	 * and optional version exists.
	 *
	 * Note: if the backup service has not been initialized yet, this may return
	 * the wrong result. Always use `resolve()` if you can do a long running
	 * operation.
	 */
	hasBackupSync(identifier: IWorkingCopyIdentifier, versionId?: number): boolean;

	/**
	 * Gets a list of working copy backups for the current workspace.
	 */
	getBackups(): Promise<IWorkingCopyIdentifier[]>;

	/**
	 * Resolves the working copy backup for the given identifier if that exists.
	 */
	resolve<T extends IWorkingCopyBackupMeta>(identifier: IWorkingCopyIdentifier): Promise<IResolvedWorkingCopyBackup<T> | undefined>;

	/**
	 * Stores a new working copy backup for the given identifier.
	 */
	backup(identifier: IWorkingCopyIdentifier, content?: ITextSnapshot, versionId?: number, meta?: IWorkingCopyBackupMeta, token?: CancellationToken): Promise<void>;

	/**
	 * Discards the working copy backup associated with the identifier if it exists.
	 */
	discardBackup(identifier: IWorkingCopyIdentifier): Promise<void>;

	/**
	 * Discards all working copy backups.
	 */
	discardBackups(): Promise<void>;
}
