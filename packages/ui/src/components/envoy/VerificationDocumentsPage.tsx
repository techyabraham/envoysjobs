import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface VerificationDocumentsPageProps {
  onBack?: () => void;
}

type DocumentType = 'id' | 'proof-of-address' | 'professional-cert' | 'reference';
type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'not-uploaded';

interface Document {
  type: DocumentType;
  title: string;
  description: string;
  required: boolean;
  status: DocumentStatus;
  fileName?: string;
  rejectionReason?: string;
  uploadedAt?: string;
}

export function VerificationDocumentsPage({ onBack }: VerificationDocumentsPageProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      type: 'id',
      title: 'Government-Issued ID',
      description: 'National ID, International Passport, or Driver\'s License',
      required: true,
      status: 'approved',
      fileName: 'national-id.pdf',
      uploadedAt: '2 days ago'
    },
    {
      type: 'proof-of-address',
      title: 'Proof of Address',
      description: 'Utility bill or bank statement (within 3 months)',
      required: true,
      status: 'pending',
      fileName: 'utility-bill.pdf',
      uploadedAt: '1 day ago'
    },
    {
      type: 'professional-cert',
      title: 'Professional Certificate',
      description: 'Degree, diploma, or certification (optional)',
      required: false,
      status: 'not-uploaded'
    },
    {
      type: 'reference',
      title: 'Reference Letter',
      description: 'Letter from previous employer or pastor (optional)',
      required: false,
      status: 'rejected',
      fileName: 'reference.pdf',
      rejectionReason: 'Document is not clear. Please upload a higher quality scan.',
      uploadedAt: '3 days ago'
    }
  ]);

  const [uploadingDoc, setUploadingDoc] = useState<DocumentType | null>(null);

  const handleFileUpload = (type: DocumentType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingDoc(type);
      // Simulate upload
      setTimeout(() => {
        setDocuments(docs =>
          docs.map(doc =>
            doc.type === type
              ? { ...doc, status: 'pending', fileName: file.name, uploadedAt: 'Just now' }
              : doc
          )
        );
        setUploadingDoc(null);
      }, 1500);
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="gold">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="urgent">Rejected</Badge>;
      case 'not-uploaded':
        return <Badge variant="outline">Not Uploaded</Badge>;
    }
  };

  const getVerificationLevel = () => {
    const approvedDocs = documents.filter(d => d.status === 'approved').length;
    const requiredApproved = documents.filter(d => d.required && d.status === 'approved').length;
    const totalRequired = documents.filter(d => d.required).length;

    if (requiredApproved === totalRequired) return 'verified';
    if (requiredApproved > 0) return 'partial';
    return 'unverified';
  };

  const level = getVerificationLevel();

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="text-foreground-secondary hover:text-foreground mb-4 transition-colors"
          >
            ← Back to Profile
          </button>
          <h1 className="text-2xl mb-2">Verification Documents</h1>
          <p className="text-foreground-secondary">
            Upload documents to verify your identity and increase trust
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Verification Status */}
        <div className={`rounded-2xl p-6 ${
          level === 'verified' ? 'bg-gradient-to-br from-emerald-green to-emerald-green-dark text-white' :
          level === 'partial' ? 'bg-gradient-to-br from-soft-gold to-soft-gold-dark text-white' :
          'bg-white border border-border'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              level === 'verified' ? 'bg-white/20' :
              level === 'partial' ? 'bg-white/20' :
              'bg-deep-blue/10'
            }`}>
              {level === 'verified' ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <AlertCircle className={`w-8 h-8 ${level === 'unverified' ? 'text-deep-blue' : 'text-white'}`} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl mb-2">
                {level === 'verified' && 'Fully Verified'}
                {level === 'partial' && 'Partially Verified'}
                {level === 'unverified' && 'Not Verified'}
              </h2>
              <p className={level === 'unverified' ? 'text-foreground-secondary' : 'text-white/90'}>
                {level === 'verified' && 'All required documents approved. You have full platform access.'}
                {level === 'partial' && 'Some documents pending. Complete verification for full access.'}
                {level === 'unverified' && 'Upload required documents to start using EnvoysJobs.'}
              </p>
              {level !== 'verified' && (
                <div className="mt-4">
                  <div className={`text-sm mb-2 ${level === 'unverified' ? 'text-foreground-secondary' : 'text-white/80'}`}>
                    Verification Progress
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${level === 'unverified' ? 'bg-border' : 'bg-white/20'}`}>
                    <div
                      className={`h-full ${level === 'unverified' ? 'bg-deep-blue' : 'bg-white'}`}
                      style={{
                        width: `${(documents.filter(d => d.required && d.status === 'approved').length / documents.filter(d => d.required).length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why Verify */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-3">Why Verify Your Account?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-green" />
              </div>
              <div>
                <div className="font-medium text-sm">Build Trust</div>
                <div className="text-xs text-foreground-secondary">Hirers prefer verified members</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-green" />
              </div>
              <div>
                <div className="font-medium text-sm">Higher Visibility</div>
                <div className="text-xs text-foreground-secondary">Appear first in search results</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-green" />
              </div>
              <div>
                <div className="font-medium text-sm">Unlock Features</div>
                <div className="text-xs text-foreground-secondary">Access messaging & applications</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-green" />
              </div>
              <div>
                <div className="font-medium text-sm">Community Safety</div>
                <div className="text-xs text-foreground-secondary">Keep our platform secure</div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.type} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  doc.status === 'approved' ? 'bg-emerald-green/10' :
                  doc.status === 'rejected' ? 'bg-destructive/10' :
                  doc.status === 'pending' ? 'bg-soft-gold/10' :
                  'bg-deep-blue/10'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    doc.status === 'approved' ? 'text-emerald-green' :
                    doc.status === 'rejected' ? 'text-destructive' :
                    doc.status === 'pending' ? 'text-soft-gold' :
                    'text-deep-blue'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{doc.title}</h3>
                        {doc.required && (
                          <span className="text-xs text-destructive">Required</span>
                        )}
                      </div>
                      <p className="text-sm text-foreground-secondary">{doc.description}</p>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>

                  {doc.fileName && (
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <span className="text-foreground-secondary">Uploaded: {doc.fileName}</span>
                      <span className="text-foreground-tertiary">• {doc.uploadedAt}</span>
                    </div>
                  )}

                  {doc.status === 'rejected' && doc.rejectionReason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-3">
                      <div className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-destructive">{doc.rejectionReason}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {doc.status === 'not-uploaded' || doc.status === 'rejected' ? (
                      <label>
                        <Button 
                          variant={doc.status === 'rejected' ? 'success' : 'primary'} 
                          size="sm"
                          disabled={uploadingDoc === doc.type}
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingDoc === doc.type ? 'Uploading...' : doc.status === 'rejected' ? 'Re-upload' : 'Upload'}
                        </Button>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload(doc.type, e)}
                          disabled={uploadingDoc === doc.type}
                        />
                      </label>
                    ) : doc.status === 'pending' ? (
                      <Button variant="ghost" size="sm" disabled>
                        <FileText className="w-4 h-4" />
                        Under Review
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-background-tertiary rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Document Guidelines</h3>
          <ul className="space-y-2 text-sm text-foreground-secondary">
            <li className="flex gap-2">
              <span>•</span>
              <span>Documents must be clear and readable</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Accepted formats: PDF, JPG, PNG (max 5MB)</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>All personal information must be visible</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Documents are reviewed within 24-48 hours</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Your information is kept secure and confidential</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
